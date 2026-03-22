import mongoose from "mongoose";

const CartDetailSchema = mongoose.Schema({
    id_cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        required: true
    },
    id_product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
},{timestamps: true})

export default mongoose.model("CartDetail", CartDetailSchema);