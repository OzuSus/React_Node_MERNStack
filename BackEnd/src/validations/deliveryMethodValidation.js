import Joi from "joi";

export const deliveryMethodSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Tên phương thức vận chuyển không được để trống",
        "any.required": "Tên phương thức vận chuyển là bắt buộc"
    }),
    description: Joi.string().optional().messages({
        "string.empty": "Mô tả không được để trống",
        "string.base": "Mô tả phải là một chuỗi"
    }),
    price: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Gia phai la mot so",
            "number.positive": "Gia phai la mot so duong",
            "any.required": "Gia san pham khong duoc de trong",
        }),
})