import mongoose from "mongoose";

const VerifyTokenChema = mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        expiryDate: {
            type: Date,
            required: true
        }
    }, {timestamps: true}
)

export default mongoose.model("VerifyToken",VerifyTokenChema);