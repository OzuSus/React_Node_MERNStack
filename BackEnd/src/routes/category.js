import express from "express";
import {getAllCategory, getCategoryById} from "../controllers/categoryController.js";
import {rateLimit} from "express-rate-limit";
import {limiter} from "../middlewares/rateLimiter.js";

const router = express.Router();
router.get("/", getAllCategory)
router.get("/:id", limiter, getCategoryById)
export default router;