import Product from "../models/Product.js";
import {ApiError} from "../utils/ApiError.js";

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

export async function getProductByIdService(productId) {
    const product = await Product.findOne({_id: productId});
    if(!product){
        throw new ApiError(404, "Ko tim thay san pham!");
    }
    return product;
}

export async function createNewProductService(productData) {
    const newProduct = await Product.create(productData);
    return newProduct;
}

export async function getProductByTagService(tag) {
    const products = await Product.find({tag: tag});
    return products;
}

export async function getFilteredProductsService(filters, sortOption, skip, limit) {
    const products = await Product.find(filters).sort(sortOption).skip(skip).limit(limit);
    const total = await Product.countDocuments(filters);
    return { products, total };
}