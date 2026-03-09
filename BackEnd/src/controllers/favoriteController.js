import {
    addFavoriteProductService,
    getFavoriteProductOfUserService,
    removeFavoriteProductService
} from "../services/favoriteService.js";

export async function getFavoriteProductOfUser(req,res,next) {
    try {
        const favoriteProduct = await getFavoriteProductOfUserService(req.user.id);
        return res.status(200).json(favoriteProduct);
    }catch (err){
        next(err);
    }
}

export async function addFavoriteProduct(req,res,next) {
    try {
        const userId = req.user.id;
        const productId = req.body.id_product;
        const newFavorite = await addFavoriteProductService(userId, productId);
        return res.status(200).json({message: "Them san pham vao danh sach yeu thich thanh cong !",favorite: newFavorite});
    }catch (err){
        next(err);
    }
}

export async function removeFavoriteProduct(req,res,next) {
    try {
        const userId = req.user.id;
        const productId = req.body.id_product;
        await removeFavoriteProductService(userId, productId);
        return res.status(200).json({message: "Xoa san pham khoi danh sach yeu thich thanh cong !"});
    }catch (err){
        next(err);
    }
}