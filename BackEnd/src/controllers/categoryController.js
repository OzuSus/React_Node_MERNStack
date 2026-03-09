import {getAllCategoryService, getCategoryByIdServive} from "../services/categoryService.js";

export async function getAllCategory(req,res,next) {
    try {
        const categories = await getAllCategoryService();
        return res.status(200).json(categories)
    }catch (err){
        next(err)
    }
}

export async function getCategoryById(req,res,next) {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryByIdServive(categoryId);
        return res.status(200).json(category)
    }catch (err){
        next(err);
    }
}