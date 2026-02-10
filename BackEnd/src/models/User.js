import mongoose from "mongoose";

const userSchema = mongoose.Schema({
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullname: {type: String},
        phone: {type: String},
        address: {type: String},
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
        avatar: {type: String},
    }, {timeStamp: true}
)
