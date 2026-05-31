import {
    createCategoryService,
    deleteCategoryService,
    getAllCategoryService,
    getCategoryByIdServive,
    updateCategoryService
} from "../services/categoryService.js";

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

export async function createCategory(req,res,next) {
    try {
        const category = await createCategoryService(buildCategoryPayload(req));
        return res.status(201).json({message: "Tao danh muc thanh cong", category})
    }catch (err){
        next(err)
    }
}

export async function updateCategory(req,res,next) {
    try {
        const category = await updateCategoryService(req.params.id, buildCategoryPayload(req, false));
        return res.status(200).json({message: "Cap nhat danh muc thanh cong", category})
    }catch (err){
        next(err)
    }
}

export async function deleteCategory(req,res,next) {
    try {
        const category = await deleteCategoryService(req.params.id);
        return res.status(200).json({message: "Xoa danh muc thanh cong", category})
    }catch (err){
        next(err)
    }
}

function buildCategoryPayload(req, requireImage = true) {
    const payload = {...req.body};
    if (req.file?.path) {
        payload.image = req.file.path;
    }
    if (!payload.image && payload.thumbnail) {
        payload.image = payload.thumbnail;
    }
    if (!requireImage && !payload.image) {
        delete payload.image;
    }
    return payload;
}
