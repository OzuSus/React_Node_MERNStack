import mongoose from "mongoose";

const OrderDetailSchema = mongoose.Schema({
    id_order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    id_product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {timestamps: true});

export default mongoose.model("OrderDetail", OrderDetailSchema);