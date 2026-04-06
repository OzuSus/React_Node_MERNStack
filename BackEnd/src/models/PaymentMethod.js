import mongoose from "mongoose";

const PaymentMethodSchema = mongoose.Schema({
    type_Payment: {
        type: String,
        required: true
    }
}, {timestamps: true});

export default mongoose.model("PaymentMethod", PaymentMethodSchema);