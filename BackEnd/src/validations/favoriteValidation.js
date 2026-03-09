import Joi from "joi";

export const favoriteSchema = Joi.object({

    id_product: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            "string.empty": "Thong tin san pham khong duoc de trong",
            "string.hex": "Thong tin san pham phai la ma ObjectId hop le (hex)",
            "string.length": "Thong tin san pham phai co do dai 24 ky tu",
        }),
})