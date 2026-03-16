import express from "express";
import {
    addFavoriteProduct,
    getFavoriteProductOfUser, isInWishLish,
    removeFavoriteProduct
} from "../controllers/favoriteController.js";
import {requireAdmin, requireAuth} from "../middlewares/authMiddleware.js";
import {limiter} from "../middlewares/rateLimiter.js";
import {validate} from "../middlewares/validateMiddleware.js";
import {favoriteSchema} from "../validations/favoriteValidation.js";

const router = express.Router();

router.get("/", requireAuth, limiter, getFavoriteProductOfUser);
router.post("/isInWishLish", requireAuth, validate(favoriteSchema), isInWishLish);
router.post("/", requireAuth, validate(favoriteSchema) ,limiter, addFavoriteProduct);
router.delete("/", requireAuth, validate(favoriteSchema) ,limiter, removeFavoriteProduct);

export default router;