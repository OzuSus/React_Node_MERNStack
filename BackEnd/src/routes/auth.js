import express from "express";
import {checkAccount, login, register, verifyEmail} from "../controllers/authController.js";
import {validate} from "../middlewares/validateMiddleware.js";
import {registerSchema} from "../validations/authValidation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", login);
router.get("/verify", verifyEmail);
router.get("/check-user", checkAccount);

export default router;