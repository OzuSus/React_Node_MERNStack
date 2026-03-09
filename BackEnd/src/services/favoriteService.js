import Favorite from "../models/Favorite.js";
import {ApiError} from "../utils/ApiError.js";
import Product from "../models/Product.js";

export async function getFavoriteProductOfUserService(userId) {
    const favoriteProduct = await Favorite.find({id_user: userId}).populate("id_product");
    return favoriteProduct;
}

export async function addFavoriteProductService(userId, productId) {
    const existingFavorite = await Favorite.findOne({id_user: userId, id_product: productId});
    if (existingFavorite) {
        throw new ApiError(400,"San pham da co trong danh sach yeu thich");
    }
    const isProductExist = await Product.findOne({_id: productId});
    if (!isProductExist) {
        throw new ApiError(404,"San pham khong ton tai");
    }
    const newFavorite = await Favorite.create({id_user: userId, id_product: productId});
    return newFavorite;
}

export async function removeFavoriteProductService(userId, productId) {
    const existingFavorite = await Favorite.findOne({id_user: userId, id_product: productId});
    if (!existingFavorite) {
        throw new ApiError(404,"San pham khong co trong danh sach yeu thich");
    }
    await Favorite.deleteOne({id_user: userId, id_product: productId});

}