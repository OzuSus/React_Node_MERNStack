import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import VerifyToken from "../models/VerifyToken.js";
import {sendVerificationEmail} from "../services/EmailService.js";

const SALT_ROUNDS = 10;
function signJWT(payload){
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"}
    );
}

export async function register(req,res) {
    try {
        console.log("req.body:", req.body);
        const {username, email, password, fullname, phone, address} = req.body;
        if (!req.body){
            res.status(400).json({message: "vui long nhap day du thong tin"});
        }
        const isExisting = await User.findOne({$or: [{username}, {email}]});
        if (isExisting){
            return res.status(409).json({message: "Email hoac Username da ton tai!"});
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
        return res.status(200).json({message: "Dang ky tai khoan thanh cong! Vui long xac thuc email"})
    }catch(err){
        console.error("Dang ky that bai, loi server: ",err);
        return res.status(500).json({message: "Loi server: ",err});
    }
}

export async function login(req,res){
    try{
        const {account, password} = req.body;
        if (!account || !password){
            return res.status(400).json({message: "Vui long nhap day du thong tin dang nhap!"});
        }
        const querry = account.includes('@') ? {email: account} : {username:account};
        const user = await User.findOne(querry);
        if (!user){
            return res.status(401).json({message: "Ko tim thay tai khoan!"})
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword){
            return res.status(401).json({message: "Sai mat khau!"});
        }
        if (user.status !== "ACTIVE"){
            return res.status(403).json({message:"Vui long xac thuc email trc khi dang nhap!"});
        }
        const jwt = signJWT({id: user._id, username: user.username, role: user.role});
        return res.status(200).json({
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
        });
    }catch (err){
        console.error("Ko the dang nhap!, loi server: ", err);
        return res.status(500).json({message: "Loi server:",err});
    }
}

export async function verifyEmail(req, res) {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).send("Token không hợp lệ");

        const record = await VerifyToken.findOne({ token });
        if (!record) return res.status(400).send("Token không hợp lệ hoặc đã hết hạn");

        const now = new Date();
        if (record.expiryDate < now) {
            await VerifyToken.deleteOne({ _id: record._id });
            return res.status(400).send("Token đã hết hạn");
        }

        await User.updateOne({ _id: record.userId }, { $set: { status: "ACTIVE" } });
        await VerifyToken.deleteOne({ _id: record._id });

        // if (process.env.FRONTEND_VERIFY_URL) {
        //     return res.redirect(`${process.env.FRONTEND_VERIFY_URL}?verified=true`);
        // }
        return res.send("Xác thực email thành công. Bạn có thể quay lại trang đăng nhập.");
    } catch (err) {
        console.error("verify error:", err);
        return res.status(500).send("Lỗi server");
    }
}

export async function checkAccount(req, res) {
    try {
        const { email, username } = req.query;
        if (email) {
            const user = await User.findOne({ email });
            return res.json({ exists: !!user });
        }
        if (username) {
            const user = await User.findOne({ username });
            return res.json({ exists: !!user });
        }
        return res.status(400).json({ message: "Cần truyền email hoặc username để kiểm tra" });
    } catch (err) {
        console.error("checkAccount error:", err);
        return res.status(500).json({ message: "Lỗi server" });
    }
}