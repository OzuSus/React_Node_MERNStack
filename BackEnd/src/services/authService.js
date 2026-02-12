import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import VerifyToken from "../models/VerifyToken.js";
import {sendVerificationEmail} from "./EmailService.js";
import crypto from "crypto";
import {ApiError} from "../utils/ApiError.js";

export function signJWT(payload){
    return  jwt.sign(payload, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    });
}

export async function registerService(data){
    const SALT_ROUNDS = 10;
    const {username, email, password, fullname, phone, address} = data;
    if (!data){
        throw new ApiError(400, "Vui long nhap day du thong tin");
    }
    const isExisting = await User.findOne({$or: [{username}, {email}]});
    if (isExisting){
        throw new ApiError(400, "Email hoac Username da ton tai!");
    }
    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({
        username,
        password: hashPassword,
        email,
        fullname,
        phone,
        address,
    })
    await user.save();

    const token = crypto.randomBytes(32).toString("hex");
    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours()+24);
    const verifyToken = new VerifyToken(
        {token,
            userId:user._id,
            expiryDate:expireDate});
    await verifyToken.save();
    await sendVerificationEmail(email, token);
}

export async function loginService(data){
    const {account, password} = data;
    if (!account || !password){
        throw new ApiError(400, "Vui long nhap day du thong tin dang nhap!");
    }
    const query = account.includes('@') ? {email: account} : {username:account};
    const user = await User.findOne(query);
    if (!user){
        throw new ApiError(404, "Ko tim thay tai khoan!");
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword){
        throw new ApiError(401, "Sai mat khau!");
    }
    if (user.status !== "ACTIVE"){
        throw new ApiError(403, "Vui long xac thuc email trc khi dang nhap!");
    }
    const jwt = signJWT({id: user._id, username: user.username, role: user.role});
    return {
        jwt,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            phong: user.phone,
            address: user.address,
            role: user.role,
            status: user.status,
        }
    };
}

export async function verifyEmailService(token){
    // const { token } = data.query.token;
    if (!token){
        throw new ApiError(400, "Token không hợp lệ");
    }
    const record = await VerifyToken.findOne({ token });
    if (!record){
        throw new ApiError(400, "Token không hợp lệ hoặc đã hết hạn");
    }
    const now = new Date();
    if (record.expiryDate < now) {
        await VerifyToken.deleteOne({ _id: record._id });
        throw new ApiError(400, "Token đã hết hạn");
    }

    await User.updateOne({ _id: record.userId }, { $set: { status: "ACTIVE" } });
    await VerifyToken.deleteOne({ _id: record._id });

    // if (process.env.FRONTEND_VERIFY_URL) {
    //     return res.redirect(`${process.env.FRONTEND_VERIFY_URL}?verified=true`);
    // }
}

export async function checkAccountService(data){
    const { email, username } = data.query;
    if (!email && !username) {
        throw new ApiError(400, "Phải cung cấp email hoặc username");
    }
    if (email) {
        const user = await User.findOne({ email });
        return ({ exists: !!user });
    }
    if (username) {
        const user = await User.findOne({ username });
        return ({ exists: !!user });
    }
}