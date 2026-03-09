import Category from "../models/Category.js";

export async function getAllCategoryService() {
    const categories = await Category.find({});
    return categories
}

export async function getCategoryByIdServive(categoryId){
    const category = await Category.findById(categoryId);
    return category
}