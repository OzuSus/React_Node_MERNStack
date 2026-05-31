import express from "express";
import {
    cancelOrder,
    getCategoryRevenue,
    getCompletedOrders,
    getAllOrders,
    getMonthlyRevenue,
    getOrderByStatus,
    getOrderByUser,
    getTotalRevenue,
    placeOrder,
    updateOrderStatus
} from "../controllers/orderController.js";
import {requireAdmin, requireAuth} from "../middlewares/authMiddleware.js";
import {validate} from "../middlewares/validateMiddleware.js";
import {orderSchema} from "../validations/orderValidation.js";
import {limiter} from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/", requireAuth, requireAdmin, limiter, getAllOrders);
router.get("/monthly-revenue", requireAuth, requireAdmin, limiter, getMonthlyRevenue);
router.get("/category-revenue", requireAuth, requireAdmin, limiter, getCategoryRevenue);
router.get("/total-revenue", requireAuth, requireAdmin, limiter, getTotalRevenue);
router.get("/completed", requireAuth, requireAdmin, limiter, getCompletedOrders);
router.post("/place", requireAuth, validate(orderSchema), limiter, placeOrder)
router.get("/orderByStatus", requireAuth, limiter, getOrderByStatus);
router.put("/:id/update-status", requireAuth, requireAdmin, limiter, updateOrderStatus);
router.get("/:userId", requireAuth, limiter, getOrderByUser);
router.put("/cancel", requireAuth, limiter, cancelOrder);

export default router;
