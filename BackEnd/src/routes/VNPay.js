import express from "express";
import {createPaymentUrl} from "../controllers/VNPayController.js";

const router = express.Router();
router.post("/vnpay_return",createPaymentUrl)

export default router;