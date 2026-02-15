import express from "express";
import {checkAccount, login, logout, me, register, verifyEmail} from "../controllers/authController.js";
import {validate} from "../middlewares/validateMiddleware.js";
import {loginSchema, registerSchema} from "../validations/authValidation.js";
import {limiter} from "../middlewares/rateLimiter.js";
import {requireAuth} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register",limiter, validate(registerSchema), register);
router.post("/login", limiter, validate(loginSchema), login);
router.get("/verify", limiter, verifyEmail);
router.get("/check-user",limiter, checkAccount);
router.get("/me", limiter,requireAuth, me);
router.post("/logout",requireAuth, logout);

export default router;