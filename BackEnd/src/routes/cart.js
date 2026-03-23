import express from "express";
import {requireAuth} from "../middlewares/authMiddleware.js";
import {
    addToCart,
    decreaseProductQuantity,
    getProductCart,
    increaseProductQuantity, removeFromCart
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", requireAuth, getProductCart);
router.post("/add", requireAuth, addToCart);
router.post("/increase", requireAuth, increaseProductQuantity);
router.post("/decrease", requireAuth, decreaseProductQuantity);
router.delete("/remove", requireAuth, removeFromCart);

export default router;