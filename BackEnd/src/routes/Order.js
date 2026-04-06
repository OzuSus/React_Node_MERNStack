import express from "express";

const router = express.Router();

router.get("/", getAllOrders);

export default router;