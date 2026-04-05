import User from "../models/User.js";
import {
    changePasswordService,
    getUserService,
    updateAccountService,
    updateAvatarService,
    validatePasswordService
} from "../services/userService.js";
export async function getUser(req, res, next) {
    try {
        const result = await getUserService({
            requester: req.user,
            userId: req.query.id
        });
        return res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function validatePassword(req, res, next) {
    try {
        const { password } = req.body;
        await validatePasswordService(password);
        return res.status(200).json({message: "Password hop le!"});
    } catch (err) {
        next(err);
    }
}

export async function updateAccount(req, res, next){
    try{
        const {fullname, address, phone} = req.body;
        const userId = req.user.id;
        const user = await updateAccountService(userId ,fullname, address, phone);
        return res.status(200).json({message: "Update tai khoan thanh cong!", user});
    }catch (err) {
        next(err);
    }
}

export async function uploadAvatar(req,res,next) {
    console.log("👉 vào controller");
    try{
        if (!req.file) {
            return res.status(400).json({ message: "Không có file" });
        }
        const userId = req.user.id;
        const avatarUrl = req.file.path;
        const user = await updateAvatarService(userId, avatarUrl);
        res.status(200).json({
            message: "Upload avatar thanh cong!",
            user
        });
    }catch (err) {
        next(err);
    }
}

export async function changePassword(req,res,next) {
    try{
        const userId = req.user.id;
        const {oldPass, newPass} = req.query;
        await changePasswordService(userId, oldPass, newPass);
        res.status(200).json({message: "Đổi mật khẩu thành công!"});
    }catch (err) {
        next(err);
    }
}
