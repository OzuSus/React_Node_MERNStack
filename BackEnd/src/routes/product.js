import express from "express";
import {limiter} from "../middlewares/rateLimiter.js";
import {createNewProduct, getAllProduct, getProductByTag} from "../controllers/productController.js";
import {validate} from "../middlewares/validateMiddleware.js";
import {productSchema} from "../validations/productValidation.js";
import {requireAdmin, requireAuth} from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", limiter, getAllProduct);
router.post("/", limiter, requireAuth, requireAdmin, validate(productSchema), createNewProduct);
router.get("/tag", limiter, getProductByTag);

export default router;