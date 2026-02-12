import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .required()
        .messages({
            "string.empty": "Username khong duoc de trong",
            "string.min": "Username phai co it nhat 3 ky tu"
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "Email khong hop le",
            "string.empty": "Email khong duoc de trong"
        }),

    password: Joi.string()
        .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)
        .required()
        .messages({
            "string.pattern.base":
                "Password phai co it nhat 8 ky tu, 1 chu in hoa, 1 so va 1 ky tu dac biet",
            "string.empty":
                "Password khong duoc de trong"
        }),

    fullname: Joi.string()
        .required()
        .messages({
            "string.empty": "Fullname khong duoc de trong"
        }),

    phone: Joi.string()
        .required()
        .messages({
            "string.empty": "Phone khong duoc de trong"
        }),

    address: Joi.string()
        .required()
        .messages({
            "string.empty": "Address khong duoc de trong"
        }),
});

export const loginSchema = Joi.object({
    account: Joi.string()
        .required()
        .messages({"string.empty":"Email hoac ten dang nhap ko dc de trong!"}),
    password: Joi.string()
        .required()
        .messages({"string.empty":"Mat khau ko dc de trong!"})
})