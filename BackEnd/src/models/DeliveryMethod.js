import mongoose, {Schema} from "mongoose";

const DeliveryMethodSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    }

}, {timestamps: true});

export default mongoose.model("DeliveryMethod", DeliveryMethodSchema);