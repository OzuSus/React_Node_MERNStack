import express from "express";
import {getAllOrders, getOrderByStatus, getOrderByUser, placeOrder} from "../controllers/orderController.js";
import {requireAuth} from "../middlewares/authMiddleware.js";
import {validate} from "../middlewares/validateMiddleware.js";
import {orderSchema} from "../validations/orderValidation.js";

const router = express.Router();

router.get("/", getAllOrders);
router.post("/place", requireAuth, validate(orderSchema), placeOrder)
router.get("/orderByStatus", requireAuth, getOrderByStatus);
router.get("/:userId", requireAuth, getOrderByUser);

export default router;