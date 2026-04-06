const StatusOrderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
}, {timestamps: true});

export default mongoose.model("StatusOrder", StatusOrderSchema);