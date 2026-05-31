import Category from "../models/Category.js";
import {ApiError} from "../utils/ApiError.js";

export async function getAllCategoryService() {
    const categories = await Category.find({});
    return categories
}

export async function getCategoryByIdServive(categoryId){
    const category = await Category.findById(categoryId);
    return category
}

export async function createCategoryService(categoryData) {
    const category = await Category.create(categoryData);
    return category;
}

export async function updateCategoryService(categoryId, categoryData) {
    const category = await Category.findByIdAndUpdate(categoryId, categoryData, {
        new: true,
        runValidators: true
    });
    if (!category) {
        throw new ApiError(404, "Khong tim thay danh muc");
    }
    return category;
}

export async function deleteCategoryService(categoryId) {
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
        throw new ApiError(404, "Khong tim thay danh muc");
    }
    return category;
}
