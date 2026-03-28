import express from "express";
import {limiter} from "../middlewares/rateLimiter.js";
import {
    createNewProduct,
    getAllProduct,
    getFilteredProducts, getProductByCategory, getProductById,
    getProductByTag
} from "../controllers/productController.js";
import {validate} from "../middlewares/validateMiddleware.js";
import {productSchema} from "../validations/productValidation.js";
import {requireAdmin, requireAuth} from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", getAllProduct);
router.get("/tag", getProductByTag);
router.get("/filter", getFilteredProducts);
router.get("/category/:idCategory", getProductByCategory);
router.get("/:id", getProductById);
router.post("/", limiter, requireAuth, requireAdmin, validate(productSchema), createNewProduct);

export default router;