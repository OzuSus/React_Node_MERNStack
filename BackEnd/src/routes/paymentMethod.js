import express from "express";

const router = express.Router();

router.get("/", getAllPaymentMethod);

export default router;