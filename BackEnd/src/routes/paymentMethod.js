import express from "express";
import {getAllPaymentMethod} from "../controllers/paymentMethodController.js";

const router = express.Router();

router.get("/", getAllPaymentMethod);

export default router;