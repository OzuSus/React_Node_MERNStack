import express from "express";
import {
    changePassword,
    getUser,
    resetPassword,
    updateAccount,
    uploadAvatar,
    validatePassword
} from "../controllers/userController.js";
import {requireAuth} from "../middlewares/authMiddleware.js";
import {validate} from "../middlewares/validateMiddleware.js";
import {userSchema} from "../validations/userValidation.js";
import {limiter} from "../middlewares/rateLimiter.js";
import uploadAvatarMiddleware from "../middlewares/uploadAvatarMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, getUser);
router.post("/validate-password", validatePassword);
router.put("/updateAccount", requireAuth, validate(userSchema), limiter, updateAccount);
router.put("/upload-avatar", requireAuth, uploadAvatarMiddleware.single("avatar"), limiter, uploadAvatar);
router.put("/change-password", requireAuth, limiter, changePassword);
router.post("/reset-password", limiter, resetPassword);

export default router;