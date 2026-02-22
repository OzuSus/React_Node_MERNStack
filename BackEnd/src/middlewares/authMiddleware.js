import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
export function requireAuth(req, res, next) {
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(401).json({ message: "Token ko hop le" });
    }
}
export function requireAdmin(req, res, next) {
    if (req.user?.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden: Chi admin moi co quyen truy cap" });
    }
    next();
}