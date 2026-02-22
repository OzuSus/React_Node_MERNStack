import Category from "../models/Category.js";

export async function getAllCategoryService() {
    const categories = await Category.find({});
    return categories
}