import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const createImageUploader = (folder, publicIdPrefix) => {
    const storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder,
            allowed_formats: ["jpg", "png", "jpeg", "webp"],
            public_id: (req, file) => `${publicIdPrefix}_${Date.now()}`
        }
    });

    return multer({ storage });
};

export const uploadProductImage = createImageUploader("products", "product");
export const uploadCategoryImage = createImageUploader("categories", "category");
