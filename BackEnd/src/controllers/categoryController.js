import {getAllCategoryService} from "../services/categoryService.js";

export async function getAllCategory(req,res,next) {
    try {
        const categories = await getAllCategoryService();
        return res.status(200).json(categories)
    }catch (err){
        next(err)
    }
}