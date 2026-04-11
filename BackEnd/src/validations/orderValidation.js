import Joi from "joi";

export const orderSchema = Joi.object({
    fullname: Joi.string().required().messages({
        "string.base": "fullname la 1 chuoi",
        "string.empty": "fullname ko dc de trong",
        "any.required": "fullname la bat buoc!"
    }),
    address: Joi.string().required().messages({
        "string.base": "address la 1 chuoi",
        "string.empty": "address ko dc de trong",
        "any.required": "address la bat buoc!"
    }),
    email: Joi.string().email().required().messages({
        "string.base": "email la 1 chuoi",
        "string.empty": "email ko dc de trong",
        "string.email": "email khong hop le",
        "any.required": "email la bat buoc!"
    }),
    phone: Joi.string().pattern(/^[0-9]+$/).required().messages({
        "string.base": "sdt la 1 chuoi",
        "string.empty": "sdt ko dc de trong",
        "string.pattern.base": "sdt ko hop le",
        "any.required": "phone la bat buoc!"
    }),
    id_payment_method: Joi.string().required().messages({
        "string.base": "payment_method la 1 chuoi 24 ky tu",
        "string.empty": "payment_method ko dc de trong",
        "any.required": "payment_method la bat buoc!"
    }),
    id_delivery_method: Joi.string().required().messages({
        "string.base": "delivery_method la 1 chuoi 24 ky tu",
        "string.empty": "delivery_method ko dc de trong",
        "any.required": "delivery_method la bat buoc!"
    }),

})