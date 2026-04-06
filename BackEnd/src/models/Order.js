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
    id_payment_method: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentMethod",
        required: true
    },
    id_status_order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StatusOrder",
        required: true
    },
    id_delivery_method: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryMethod",
        required: true
    },
}, {timestamps: true});

export default mongoose.model("Order", OrderSchema);

