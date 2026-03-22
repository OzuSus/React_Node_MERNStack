import Cart from "../models/Cart.js";

export async function createCart(userId) {
    return await Cart.create({id_user: userId});
}