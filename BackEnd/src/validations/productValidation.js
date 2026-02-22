import Joi from "joi";

export const productSchema = Joi.object({
    name: Joi.string()
        .required()
        .messages({
            "string.empty": "Ten san pham khong duoc de trong",
        }),
    price: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Gia phai la mot so",
            "number.positive": "Gia phai la mot so duong",
            "any.required": "Gia san pham khong duoc de trong",
        }),
    description: Joi.string()
        .max(100)
        .required()
        .messages({
            "string.empty": "Mo ta khong duoc de trong",
            "string.max": "Mo ta khong duoc vuot qua 100 ky tu",
        }),
    tag: Joi.string()
        .valid("NEW", "HOT", "SALE")
        .default("NEW")
        .messages({
            "any.only": "Tag phai la mot trong cac gia tri: NEW, HOT, SALE",
        }),
    image: Joi.string()
        .required()
        .messages({
            "string.empty": "Anh san pham khong duoc de trong",
        }),
    quantity: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            "number.base": "So luong phai la mot so ",
            "number.min": "So luong phai lon hon hoac bang 0",
            "any.required": "So luong khong duoc de trong",
        }),
    id_category: Joi.string()
        .required()
        .messages({
            "string.empty": "Thong tin phan loai khong duoc de trong",
        }),
    id_jeweler: Joi.string()
        .required()
        .messages({
            "string.empty": "Thong tin tho kim hoan khong duoc de trong",
        }),
});