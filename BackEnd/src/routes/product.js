import express from "express";
import {limiter} from "../middlewares/rateLimiter.js";
import {createNewProduct, getAllProduct} from "../controllers/productController.js";
import {get} from "mongoose";
import {validate} from "../middlewares/validateMiddleware.js";
import {productSchema} from "../validations/productValidation.js";
import {requireAdmin} from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", limiter, getAllProduct);
router.post("/", limiter, requireAdmin, validate(productSchema), createNewProduct);

export default router;