import Joi from "joi";

export const statusOrderSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.base": "name statusOrder phải là một chuỗi",
        "string.empty": "name statusOrder ko dc để trống",
        "string.required": "name statusOrder là bắt buộc"
    })
});