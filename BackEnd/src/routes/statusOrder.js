import express from "express";
import {requireAdmin, requireAuth} from "../middlewares/authMiddleware.js";
import {limiter} from "../middlewares/rateLimiter.js";
import {validate} from "../middlewares/validateMiddleware.js";
import {statusOrderSchema} from "../validations/statusOrderValidation.js";
import {createNewStatusOrder, getAllStatusOrder} from "../controllers/statusOrderController.js";

const router = express.Router();
router.post("/",requireAuth, requireAdmin, limiter, validate(statusOrderSchema), createNewStatusOrder);
router.get("/", requireAuth, getAllStatusOrder);

export default router;