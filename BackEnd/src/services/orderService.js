import Product from "../models/Product.js";
import Order from "../models/Order.js";
import {ApiError} from "../utils/ApiError.js";
import CartDetail from "../models/CartDetail.js";
import Cart from "../models/Cart.js";
import OrderDetail from "../models/OrderDetail.js";
import DeliveryMethod from "../models/DeliveryMethod.js";
import path from "path";
import StatusOrder from "../models/StatusOrder.js";

export async function getAllOrderService(page, limit) {
    const numericPage = Number(page) || 1;
    const numericLimit = Number(limit) || 10;
    const safePage = Math.min(Math.max(numericPage, 1), MAX_PAGE);
    const safeLimit = Math.min(Math.max(numericLimit, 1), MAX_LIMIT);
    const skip = (safePage - 1) * safeLimit;
    const orders = await Order.find({}).skip(skip).limit(safeLimit);
    const total = await Order.countDocuments({});
    return {orders, total}
}

export async function placeOrderService(userId, formData) {
    const cartUser = await Cart.findOne({id_user: userId});
    if (!cartUser) {
        throw new ApiError(404,"Giỏ hàng của người dùng không tồn tại.");
    }
    const cartItems = await CartDetail.find({id_cart: cartUser._id});
    if (!cartItems || cartItems.length === 0) {
        throw new ApiError(400,"Ko co san pham trong gio hang!");
    }
    const deliveryMethod = await DeliveryMethod.findById(formData.id_delivery_method);
    if (!deliveryMethod) {
        throw new ApiError(404, "Phương thức vận chuyển không hợp lệ.");
    }
    const shippingFee = deliveryMethod.price;


    let itemsTotalPrice = 0;
    for (const item of cartItems) {
        const product = await Product.findById(item.id_product);
        if (!product) throw new ApiError(404, `Sản phẩm không tồn tại!`);
        itemsTotalPrice += (product.price * item.quantity);
        // orderDetailsList.push({
        //     id_product: item.id_product,
        //     quantity: item.quantity,
        //     price: product.price
        // });
    }
    const finalTotalPrice = itemsTotalPrice + shippingFee;
    const orderData = {
        ...formData,
        id_user: userId,
        total_price: finalTotalPrice
    };
    const order = await Order.create(orderData);
    for (const item of cartItems) {
        const product = await Product.findById(item.id_product);
        if (!product) throw new ApiError(404, `Sản phẩm không tồn tại!`);
        await OrderDetail.create({
            id_order: order._id,
            id_product: item.id_product,
            quantity: item.quantity,
            price: product.price * item.quantity,
        });
        await CartDetail.findByIdAndDelete(item._id);
    }
    return order;
}


export async function getOrderByStatusService(userId, status) {
    const orders = await Order.find({id_user: userId, status_order: status})
        .populate({
            path: "id_user",
            select: "-password"
        })
        .populate("id_payment_method")
        .populate("status_order")
        .populate("id_delivery_method");

    if (!orders || orders.length === 0) {
        return { message: "Chưa có đơn hàng!", orders: [] };
    }
    const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
            const orderDetails = await OrderDetail.find({ id_order: order._id })
                .populate({
                    path: "id_product",
                    select: "name price image id_category",
                    populate: {
                        path: "id_category",
                        select: "name description"
                    }
                });
            return {
                ...order.toObject(),
                orderDetails
            };
        })
    );
    return ordersWithDetails;
}

export async function getOrderByUserService(userId) {
    const orders = await Order.find({ id_user: userId })
        .populate({
            path: "id_user",
            select: "-password"
        })
        .populate("id_payment_method")
        .populate("status_order")
        .populate("id_delivery_method");

    if (!orders || orders.length === 0) {
        return { message: "Chưa có đơn hàng!", orders: [] };
    }
    const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
            const orderDetails = await OrderDetail.find({ id_order: order._id })
                .populate({
                    path: "id_product",
                    select: "name price image id_category",
                    populate: {
                        path: "id_category",
                        select: "name description"
                    }
                });
            return {
                ...order.toObject(),
                orderDetails
            };
        })
    );

    return ordersWithDetails;
}
export async function cancelOrderService(orderId, userId) {
    const order = await Order.findOne({ _id: orderId, id_user: userId }).populate("status_order");
    if (!order) {
        throw new ApiError(404, "Đơn hàng không tồn tại hoặc không thuộc về người dùng.");
    }
    if (!order.status_order || !order.status_order.name) {
        throw new ApiError(400, "Trạng thái đơn hàng không hợp lệ.");
    }
    if (order.status_order.name !== "Chưa xác nhận") {
        throw new ApiError(400, "Trạng thái đơn hàng không thể hủy đơn hàng!");
    }

    const canceledStatus = await StatusOrder.findOne({ name: "Đã hủy" });
    if (!canceledStatus) {
        throw new ApiError(404, "Trạng thái 'Đã hủy' không tồn tại.");
    }

    order.status_order = canceledStatus._id;
    await order.save();
}