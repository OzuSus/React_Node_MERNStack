import Product from "../models/Product.js";
import Order from "../models/Order.js";
import {ApiError} from "../utils/ApiError.js";
import CartDetail from "../models/CartDetail.js";
import Cart from "../models/Cart.js";
import OrderDetail from "../models/OrderDetail.js";
import DeliveryMethod from "../models/DeliveryMethod.js";

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