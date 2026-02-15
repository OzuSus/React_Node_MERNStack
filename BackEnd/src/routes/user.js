import express from "express";
import {getUser, validatePassword} from "../controllers/userController.js";
import {requireAuth} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, getUser);
router.post("/validate-password", validatePassword);

export default router;