import express from "express";
import {limiter} from "../middlewares/rateLimiter.js";
import {
    createNewProduct,
    deleteProduct,
    getAllProduct,
    getFilteredProducts, getProductByCategory, getProductById,
    getProductByTag,
    updateProduct
} from "../controllers/productController.js";
import {validate} from "../middlewares/validateMiddleware.js";
import {productSchema, productUpdateSchema} from "../validations/productValidation.js";
import {requireAdmin, requireAuth} from "../middlewares/authMiddleware.js";
import {uploadProductImage} from "../middlewares/uploadImageMiddleware.js";

const router = express.Router();

const attachProductFields = (includeOwner = true) => (req, res, next) => {
    if (req.body.prize && !req.body.price) {
        req.body.price = req.body.prize;
    }
    delete req.body.prize;

    if (req.file?.path) {
        req.body.image = req.file.path;
    }

    if (includeOwner && !req.body.id_jeweler) {
        req.body.id_jeweler = req.user.id;
    }

    next();
};

router.get("/", getAllProduct);
router.get("/tag", getProductByTag);
router.get("/filter", getFilteredProducts);
router.get("/category/:idCategory", getProductByCategory);
router.get("/:id", getProductById);
router.post("/", limiter, requireAuth, requireAdmin, uploadProductImage.single("image"), attachProductFields(), validate(productSchema), createNewProduct);
router.put("/:id", limiter, requireAuth, requireAdmin, uploadProductImage.single("image"), attachProductFields(false), validate(productUpdateSchema), updateProduct);
router.delete("/:id", limiter, requireAuth, requireAdmin, deleteProduct);

export default router;
