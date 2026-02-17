import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import VerifyToken from "../models/VerifyToken.js";
import {sendVerificationEmail} from "../services/EmailService.js";
import {
    checkAccountService,
    loginService, meService,
    registerService, resendVerificationService,
    verifyEmailService,
} from "../services/authService.js";
import path from "path";
import {fileURLToPath} from "url";
import * as fs from "fs";
import {ApiError} from "../utils/ApiError.js";


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

export async function login(req, res, next) {
    try {
        const { token, user } = await loginService(req.body);
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7
        };
        res.cookie("token", token, cookieOptions);
        return res.status(200).json({ user });
    } catch (err) {
        console.error("Ko the dang nhap!, loi server: ", err);
        next(err);
    }
}

export async function verifyEmail(req, res, next) {
    try {
        const token = req.query.token;
        await verifyEmailService(token);

        const successFile = fileURLToPath(
            new URL("../../public/verify_success.html", import.meta.url)
        );

        return res.sendFile(successFile);

    } catch (err) {

        if (err.statusCode === 410 && err.email) {
            return res.redirect(
                `/verify-expired.html?email=${err.email}`
            );
        }

        const failedFile = fileURLToPath(
            new URL("../../public/verify-failed.html", import.meta.url)
        );

        return res.sendFile(failedFile);
    }
}

export async function checkAccount(req, res) {
    try {
        const result =  await checkAccountService(req.query);
        return res.status(200).json(result);
    } catch (err) {
        console.error("checkAccount error:", err);
        return res.status(500).json({ message: "Lỗi server" });
    }
}
export async function me(req, res, next) {
    try {
        const user = await meService(req.user.id);
        return res.json(user);
    } catch (err) {
        next(err);
    }
}
export async function resendVerification(req, res, next) {
    try {
        const { email } = req.body;
        await resendVerificationService(email);
        return res.status(200).json({
            message: "Email xác thực mới đã được gửi."
        });
    } catch (err) {
        next(err);
    }
}



export function logout(req, res) {
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
    return res.json({ message: "Logged out" });
}