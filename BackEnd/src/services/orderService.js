import Product from "../models/Product.js";
import Order from "../models/Order.js";

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