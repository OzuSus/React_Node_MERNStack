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
    await sendVerificationEmail(email, username, token);
}
export async function loginService(data) {
    const { account, password } = data || {};
    if (!account || !password) {
        throw new ApiError(400, "Vui lòng nhập đầy đủ thông tin đăng nhập!");
    }

    const query = account.includes("@") ? { email: account } : { username: account };
    const user = await User.findOne(query).exec();
    if (!user) {
        throw new ApiError(401, "Tài khoản hoặc mật khẩu không đúng!");
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
        throw new ApiError(401, "Tài khoản hoặc mật khẩu không đúng!");
    }

    if (user.status !== "ACTIVE") {
        throw new ApiError(403, "Vui lòng xác thực email trước khi đăng nhập!");
    }

    const token = signJWT({
        id: user._id,
        username: user.username,
        role: user.role
    });

    return {
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
            status: user.status
        }
    };
}

export async function verifyEmailService(token){
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
        throw new ApiError(410, "Token đã hết hạn");
    }
    const user = await User.findById(record.userId).exec();
    if (!user) {
        await VerifyToken.deleteOne({ _id: record._id });
        throw new ApiError(404, "User không tồn tại");
    }
    user.status = "ACTIVE";
    await user.save();

    await VerifyToken.deleteOne({ _id: record._id });
    return { id: user._id.toString(), username: user.username };

}

export async function checkAccountService(data){
    const { email, username } = data;
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

export async function meService(userId) {
    const user = await User.findById(userId).select("-password").lean();
    if (!user) {
        throw new ApiError(401, "UnAuthorized");
    }
    return user;
}
