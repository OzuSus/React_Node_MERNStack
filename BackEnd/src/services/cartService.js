import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import {ApiError} from "../utils/ApiError.js";
import CartDetail from "../models/CartDetail.js";

export async function createCart(userId) {
    return await Cart.create({id_user: userId});
}

export async function getProductCartService(userId) {
    const productCart = await Cart.find({id_user: userId});
    return productCart;
}

export async function addToCartService(userId, productId) {
    let cart = await Cart.findOne({id_user: userId});
    if (!cart) {
        cart = await createCart(userId);
    }
    const product = await Product.findById(productId);
    if(!product) {
        throw new ApiError(400, "Sản phẩm không tồn tại");
    }
    await CartDetail.create({ id_cart: cart._id, id_product: productId, quantity: 1 });
}

export async function increaseProductQuantityService(userId, productId) {
    const cart = await Cart.findOne({id_user: userId});
    if (!cart) {
        throw new ApiError(400, "Giỏ hàng không tồn tại");
    }
    const cartDetail = await CartDetail.findOne({id_cart: cart._id ,id_product: productId });
    if (!cartDetail) {
        throw new ApiError(400, "Sản phẩm không tồn tại trong giỏ hàng");
    }
    cartDetail.quantity += 1;
    await cartDetail.save();
}

export async function decreaseProductQuantityService(userId, productId) {
    const cart = await Cart.findOne({id_user: userId});
    if (!cart) {
        throw new ApiError(400, "Giỏ hàng không tồn tại");
    }
    const cartDetail = await CartDetail.findOne({id_cart: cart._id ,id_product: productId });
    if (!cartDetail) {
        throw new ApiError(400, "Sản phẩm không tồn tại trong giỏ hàng");
    }
    if(cartDetail.quantity == 1) {
        await cartDetail.deleteOne();
        return;
    }
    cartDetail.quantity -= 1;
    await cartDetail.save();
}

export async function removeFromCartService(userId, productId) {
    const cart = await Cart.findOne({id_user: userId});
    if (!cart) {
        throw new ApiError(400, "Giỏ hàng không tồn tại");
    }
    const cartDetail = await CartDetail.findOne({id_cart: cart._id ,id_product: productId });
    if(!cartDetail) {
        throw new ApiError(400, "Sản phẩm không tồn tại trong giỏ hàng");
    }
    await cartDetail.deleteOne();
}

