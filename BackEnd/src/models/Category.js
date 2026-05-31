import mongoose from "mongoose";

const CategorySchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            maxLength: 50,
        },
        image: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE",
        },
    }, {timestamps: true}
)

export default mongoose.model("Category", CategorySchema);
