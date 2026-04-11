import Joi from "joi";

export const paymentMethodSchema = Joi.object({
    type_Payment: Joi.string().required().messages({
        "string.base": "type_Payment la 1 chuoi",
        "string.empty": "type_Payment ko dc de trong",
        "any.required": "type_Payment la bat buoc!"
    })
})