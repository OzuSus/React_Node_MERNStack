import express from "express";
import {getUser} from "../controllers/userController.js";
import {requireAuth} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, getUser);

export default router;