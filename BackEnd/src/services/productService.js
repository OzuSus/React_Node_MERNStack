import Product from "../models/Product.js";

export async function getAllProductService(page, limit) {
    const skip = (page - 1) * limit;
    const product = await Product.find({}).skip(skip).limit(limit);
    const total = await Product.countDocuments({});
    return {product, total}
}