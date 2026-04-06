import mongoose from "mongoose";
import express from "express";

const router = express.Router();
router.get("/", getAllDeliveryMethod);

export default router;