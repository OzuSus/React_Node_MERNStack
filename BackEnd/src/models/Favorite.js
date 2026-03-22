import mongoose from "mongoose";

const FavoriteSchema = mongoose.Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    id_product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    }
}, {timestamps: true, collection: "favorites"})

export default mongoose.model("Favorite", FavoriteSchema);
