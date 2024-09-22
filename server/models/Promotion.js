import mongoose from "mongoose";

const PromotionSchema = new mongoose.Schema({
    Card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card",
        required: true
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        nullable: true, //aparece para todos os usuário quando for null
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    expireAt: {
        type: Date,
        expires: 10,
        default: Date.now,
        required: true,
    }
})

export default new mongoose.model("Promotion", PromotionSchema)