import {
    addToCartService,
    decreaseProductQuantityService,
    getProductCartService,
    increaseProductQuantityService, removeFromCartService
} from "../services/cartService.js";

export async function getProductCart(req,res,next) {
    try {
        const userId = req.user.id;
        const cartProducts = await getProductCartService(userId);
        return res.status(200).json(cartProducts);
    }catch (err) {
        next(err);
    }
}

export async function addToCart(req,res,next) {
    try {
        const productId = req.body.productId;
        const userId = req.user.id;
        await addToCartService(userId, productId);
        return res.status(200).json({message: "Them san pham vao gio hangf thanh cong"});
    }catch (err) {
        next(err);
    }
}

export async function increaseProductQuantity(req,res,next) {
    try {
        const productId = req.body.productId;
        const userId = req.user.id;
        await increaseProductQuantityService(userId, productId);
        return res.status(200).json({message: "Tang so luong san pham trong gio hang thanh cong"});
    }catch (err) {
        next(err);
    }
}

export async function decreaseProductQuantity(req,res,next) {
    try {
        const productId = req.body.productId;
        const userId = req.user.id;
        await decreaseProductQuantityService(userId, productId);
        return res.status(200).json({message: "Giam so luong san pham trong gio hang thanh cong"});
    }catch (err) {
        next(err);
    }
}

export async function removeFromCart(req,res,next) {
    try {
        const productId = req.body.productId;
        const userId = req.user.id;
        await removeFromCartService(userId, productId);
        return res.status(200).json({message: "Xoa san pham trong gio hang thanh cong"});
    }catch (err) {
        next(err);
    }
}