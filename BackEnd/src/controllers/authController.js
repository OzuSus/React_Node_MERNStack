import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import VerifyToken from "../models/VerifyToken.js";
import {sendVerificationEmail} from "../services/EmailService.js";
import {
    checkAccountService,
    loginService,
    registerService,
    verifyEmailService,
} from "../services/authService.js";


export async function register(req,res,next) {
    try {
        console.log("req.body:", req.body);
        await registerService(req.body);
        return res.status(200).json({message: "Dang ky tai khoan thanh cong! Vui long xac thuc email"})
    }catch(err){
        console.error("Dang ky that bai, loi server: ",err);
        next(err);
    }
}

export async function login(req,res, next){
    try{
        const result = await loginService(req.body);
        return res.status(200).json(result);
    }catch (err){
        console.error("Ko the dang nhap!, loi server: ", err);
        // return res.status(err.statusCode || 500).json({message: err.message || "Loi server:",err});
        next(err);
    }
}

export async function verifyEmail(req, res, next) {
    try {
        await verifyEmailService(req.query.token);
        return res.send("Xác thực email thành công. Bạn có thể quay lại trang đăng nhập.");
    } catch (err) {
        console.error("verify error:", err);
        // return res.status(err.statusCode || 500).send(err.message || "Lỗi server");
        next(err);
    }
}

export async function checkAccount(req, res) {
    try {
        const result =  await checkAccountService(req.body);
        return res.status(200).json(result);
    } catch (err) {
        console.error("checkAccount error:", err);
        return res.status(500).json({ message: "Lỗi server" });
    }
}