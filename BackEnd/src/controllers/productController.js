import {
    createNewProductService,
    getAllProductService,
    getFilteredProductsService, getProductByCategoryService, getProductByIdService,
    getProductByTagService
} from "../services/productService.js";

export async function getAllProduct(req,res,next) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const {product, total} = await getAllProductService(page, limit);
        return res.status(200).json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            product
        })
    }catch (err){
        next(err)
    }
}

export async function getProductById(req,res,next) {
    try{
        const productId = req.params.id;
        const product = await getProductByIdService(productId);
        return res.status(200).json({product})
    }catch (err){
        next(err);
    }
}

export async function getProductByCategory(req,res,next) {
    try{
        const categoryId = req.params.idCategory;
        const products = await getProductByCategoryService(categoryId);
        return res.status(200).json({products})
    }catch (err){
        next(err);
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

export async function getProductByTag(req,res,next) {
    try {
        const tag = req.query.tag;
        const products = await getProductByTagService(tag);
        return res.status(200).json({products})
    }catch (err){
        next(err)
    }
}

export async function getFilteredProducts(req, res, next) {
    try {
        const {minPrice, maxPrice, category, rating, sort, page = 1, limit = 10} = req.query;
        const filters = {};
        if (minPrice || maxPrice) {
            filters.price = {};
            if (minPrice) filters.price.$gte = Number(minPrice);
            if (maxPrice) filters.price.$lte = Number(maxPrice);
        }
        if (category) {
            filters.id_category = category;
        }
        if (rating) {
            filters.rating = { $gte: Number(rating) };
        }
        const sortOption = sort === "desc" ? { price: -1 } : { price: 1 };

        const skip = (page - 1) * limit;

        const { products, total } = await getFilteredProductsService(filters, sortOption, skip, Number(limit));
        return res.status(200).json({
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
            product: products
        });
    } catch (err) {
        next(err);
    }
}