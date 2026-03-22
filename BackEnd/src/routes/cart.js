import express from "express";
import {requireAuth} from "../middlewares/authMiddleware.js";
import {addToCart, getProductCart} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", requireAuth, getProductCart);
router.post("/add", requireAuth, addToCart);

export default router;