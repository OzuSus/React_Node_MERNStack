import express from "express";
import {checkAccount, login, register, verifyEmail} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify", verifyEmail);
router.get("/check-user", checkAccount);

export default router;