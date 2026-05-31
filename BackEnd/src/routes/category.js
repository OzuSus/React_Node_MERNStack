import express from "express";
import {
    createCategory,
    deleteCategory,
    getAllCategory,
    getCategoryById,
    updateCategory
} from "../controllers/categoryController.js";
import {limiter} from "../middlewares/rateLimiter.js";
import {requireAdmin, requireAuth} from "../middlewares/authMiddleware.js";
import {uploadCategoryImage} from "../middlewares/uploadImageMiddleware.js";

const router = express.Router();
router.get("/", getAllCategory)
router.get("/:id", getCategoryById)
router.post("/", limiter, requireAuth, requireAdmin, uploadCategoryImage.single("image"), createCategory)
router.put("/:id", limiter, requireAuth, requireAdmin, uploadCategoryImage.single("image"), updateCategory)
router.delete("/:id", limiter, requireAuth, requireAdmin, deleteCategory)
export default router;
