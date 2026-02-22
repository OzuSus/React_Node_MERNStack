import express from "express";
import {limiter} from "../middlewares/rateLimiter.js";
import {getAllProduct} from "../controllers/productController.js";
import {get} from "mongoose";

const router = express.Router();
router.get("/", limiter, getAllProduct)

export default router;