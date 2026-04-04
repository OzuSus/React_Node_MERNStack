import {CloudinaryStorage} from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "avatars",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        public_id: (req, file) => `user_${req.user.id}`
    }
})

const uploadAvatarMiddleware = multer({ storage: avatarStorage });
export default uploadAvatarMiddleware;