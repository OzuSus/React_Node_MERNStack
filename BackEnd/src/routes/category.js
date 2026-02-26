import express from "express";
import {getAllCategory} from "../controllers/categoryController.js";
import {rateLimit} from "express-rate-limit";

const router = express.Router();
router.get("/", getAllCategory)
router.get("/:id", rateLimit, getAllCategory)
export default router;