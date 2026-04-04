import Joi from "joi";
export const userSchema = Joi.object({
    fullname: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.empty": "Fullname khong duoc de trong",
            "string.min": "Fullname phai co it nhat 3 ky tu",
            "string.max": "Fullname khong duoc vuot qua 50 ky tu",
        }),
    address: Joi.string()
        .min(5)
        .max(100)
        .required()
        .messages({
            "string.empty": "Address khong duoc de trong",
            "string.min": "Address phai co it nhat 5 ky tu",
            "string.max": "Address khong duoc vuot qua 100 ky tu",
        }),
    phone: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
            "string.empty": "sdt khong duoc de trong",
            "string.pattern.base": "sdt phai du 10 so !",
        }),
})