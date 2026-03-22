import mongoose from "mongoose";

const CartSchema = mongoose.Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, {timestamps: true})

export default mongoose.model("Cart", CartSchema);
