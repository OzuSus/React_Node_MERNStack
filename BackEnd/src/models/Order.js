import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date_order: {
        type: Date,
        default: Date.now
    },
    fullname:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    total_price:{
        type: Number,
        required: true
    },
    id_payment_method: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentMethod",
        required: true
    },
    status_order: {
        type: String,
        enum: ["Chưa xác nhận", "Đã xác nhận", "Đang giao hàng", "Đã giao hàng", "Đã hủy"],
        default: "Chưa xác nhận",
    },
    id_delivery_method: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryMethod",
        required: true
    },
}, {timestamps: true});

export default mongoose.model("Order", OrderSchema);

