import express from "express";
import {getAllOrders, placeOrder} from "../controllers/orderController.js";
import {requireAuth} from "../middlewares/authMiddleware.js";
import {validate} from "../middlewares/validateMiddleware.js";
import {orderSchema} from "../validations/orderValidation.js";

const router = express.Router();

router.get("/", getAllOrders);
router.post("/place", requireAuth, validate(orderSchema), placeOrder)

export default router;