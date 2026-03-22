import express from "express";
import {requireAuth} from "../middlewares/authMiddleware.js";

const router = express.Router();

// router.get("/", requireAuth, getProductCart);

export default router;