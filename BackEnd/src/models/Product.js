import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            maxLength: 100,
            required: true,
        },
        tag: {
            type: String,
            enum: ["NEW", "HOT", "SALE"],
            default: "NEW",
        },
        image: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            min: 0,
            required: true,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        review: {
            type: Number,
            default: 0,
        },
        id_category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        id_jeweler: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    }, {timestamps: true, collection: "products"}
)

export default mongoose.model("Product", ProductSchema);