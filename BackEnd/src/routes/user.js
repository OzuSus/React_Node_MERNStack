import express from "express";
import {
    changePassword,
    checkUserExists,
    confirmCollaborator,
    createUserByAdmin,
    getPendingCollaborators,
    getRegularUserMonthlyStats,
    getRegularUsers,
    getUser,
    resetPassword,
    updateAccount,
    uploadAvatar,
    validatePassword
} from "../controllers/userController.js";
import {requireAdmin, requireAuth} from "../middlewares/authMiddleware.js";
import {validate} from "../middlewares/validateMiddleware.js";
import {userSchema} from "../validations/userValidation.js";
import {limiter} from "../middlewares/rateLimiter.js";
import uploadAvatarMiddleware from "../middlewares/uploadAvatarMiddleware.js";

const router = express.Router();

router.get("/regular", requireAuth, requireAdmin, getRegularUsers);
router.get("/regular/monthly-stats", requireAuth, requireAdmin, getRegularUserMonthlyStats);
router.get("/check-user", requireAuth, requireAdmin, checkUserExists);
router.get("/ctv-pending", requireAuth, requireAdmin, getPendingCollaborators);
router.post("/register", requireAuth, requireAdmin, createUserByAdmin);
router.post("/:id/confirm-ctv", requireAuth, requireAdmin, confirmCollaborator);
router.get("/", requireAuth, getUser);
router.post("/validate-password", validatePassword);
router.put("/updateAccount", requireAuth, validate(userSchema), limiter, updateAccount);
router.put("/upload-avatar", requireAuth, uploadAvatarMiddleware.single("avatar"), limiter, uploadAvatar);
router.put("/change-password", requireAuth, limiter, changePassword);
router.post("/reset-password", limiter, resetPassword);

export default router;
