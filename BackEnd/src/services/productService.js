import Product from "../models/Product.js";

const MAX_PAGE = 1000;
const MAX_LIMIT = 100;
export async function getAllProductService(page, limit) {
    const numericPage = Number(page) || 1;
    const numericLimit = Number(limit) || 10;
    const safePage = Math.min(Math.max(numericPage, 1), MAX_PAGE);
    const safeLimit = Math.min(Math.max(numericLimit, 1), MAX_LIMIT);
    const skip = (safePage - 1) * safeLimit;
    const product = await Product.find({}).skip(skip).limit(safeLimit);
    const total = await Product.countDocuments({});
    return {product, total}
}

export async function createNewProductService(productData) {
    const newProduct = await Product.create(productData);
    return newProduct;
}