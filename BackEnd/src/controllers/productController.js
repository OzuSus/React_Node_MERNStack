import {createNewProductService, getAllProductService} from "../services/productService.js";

export async function getAllProduct(req,res,next) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const {products, total} = await getAllProductService(page, limit);
        return res.status(200).json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            products
        })
    }catch (err){
        next(err)
    }
}

export async function createNewProduct(req,res,next) {
    try {
        const productData = req.body;
        const newProduct = await createNewProductService(productData);
        return res.status(200).json({message: "Tao San pham moi thanh cong", product: newProduct})
    }catch (err){
        next(err)
    }
}