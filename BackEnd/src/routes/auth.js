import express from "express";
import {checkAccount, login, register, verifyEmail} from "../controllers/authController.js";
import {validate} from "../middlewares/validateMiddleware.js";
import {loginSchema, registerSchema} from "../validations/authValidation.js";
import {limiter} from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", limiter, validate(registerSchema), register);
router.post("/login", limiter, validate(loginSchema), login);
router.get("/verify", limiter, verifyEmail);
router.get("/check-user", limiter, checkAccount);

export default router;