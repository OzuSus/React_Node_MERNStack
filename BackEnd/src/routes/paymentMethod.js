import express from "express";
import {createNewPaymentMethod, getAllPaymentMethod} from "../controllers/paymentMethodController.js";
import {requireAdmin, requireAuth} from "../middlewares/authMiddleware.js";
import {validate} from "../middlewares/validateMiddleware.js";
import {paymentMethodSchema} from "../validations/paymentMethodValidation.js";
import {limiter} from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/", getAllPaymentMethod);
router.post("/", requireAuth, requireAdmin, limiter, validate(paymentMethodSchema), createNewPaymentMethod);

export default router;