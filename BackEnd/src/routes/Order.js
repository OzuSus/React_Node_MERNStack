import express from "express";
import {getAllOrders} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getAllOrders);

export default router;