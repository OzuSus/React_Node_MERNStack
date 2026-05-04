import express from "express";
import {getAllOrders, getOrderByStatus, getOrderByUser, placeOrder} from "../controllers/orderController.js";
import {requireAuth} from "../middlewares/authMiddleware.js";
import {validate} from "../middlewares/validateMiddleware.js";
import {orderSchema} from "../validations/orderValidation.js";
import {limiter} from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/", limiter, getAllOrders);
router.post("/place", requireAuth, validate(orderSchema), limiter, placeOrder)
router.get("/orderByStatus", requireAuth, limiter, getOrderByStatus);
router.get("/:userId", requireAuth, limiter, getOrderByUser);

export default router;