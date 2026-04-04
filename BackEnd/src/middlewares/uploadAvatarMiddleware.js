import {CloudinaryStorage} from "multer-storage-cloudinary";
import multer from "multer";

const avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "avatars",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    }
})

const uploadAvatarMiddleware = multer({ storage: avatarStorage });
export default uploadAvatarMiddleware;