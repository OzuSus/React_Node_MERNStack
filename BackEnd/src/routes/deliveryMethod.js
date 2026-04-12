import mongoose from "mongoose";
import express from "express";
import {requireAdmin, requireAuth} from "../middlewares/authMiddleware.js";
import {createNewDeliveryMethod, getAllDeliveryMethod} from "../controllers/deliveryMethodController.js";
import {validate} from "../middlewares/validateMiddleware.js";
import {deliveryMethodSchema} from "../validations/deliveryMethodValidation.js";

const router = express.Router();
router.get("/", getAllDeliveryMethod);
router.post("/", requireAuth, requireAdmin,validate(deliveryMethodSchema),  createNewDeliveryMethod);

export default router;