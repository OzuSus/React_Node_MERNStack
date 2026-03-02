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
            maxLength: 50,
        },
    }, {timestamps: true}
)

export default mongoose.model("Category", CategorySchema);