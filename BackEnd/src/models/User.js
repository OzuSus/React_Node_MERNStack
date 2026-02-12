import mongoose from "mongoose";

const userSchema = mongoose.Schema({
        username: {
            type: String,
            required: true,
            unique: true,
            trim:true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim:true,
            lowercase: true,
        },
        fullname: {type: String, required: true},
        phone: {type: String, required: true},
        address: {type: String, default:""},
        role: {
            type: String,
            enum: ["ADMIN", "USER", "JEWELER"],
            default: "USER",
        },
        status: {
            type: String,
            enum: ["PENDING", "ACTIVE", "BLOCK"],
            default: "PENDING",
        },
        avatar: {type: String,default:null},
    }, {timeStamp: true,collection: "users"}
);
export default mongoose.model("User",userSchema);
