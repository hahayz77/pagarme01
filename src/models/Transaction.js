import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    cartCode: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: [
            "started",
            "processing",
            "pending",
            "approved",
            "refused",
            "refunded",
            "chargeback",
            "error"
        ]
    },
    paymentType: {
        type: String,
        required: true,
        enum: [
            "billet",
            "credit_cart"
        ]
    },
    installments: {
        type: Number,
    },
    total: {
        type: Number,
    },
    transactionId: {
        type: String,
    },
    processorReponse: {
        type: String,
    },
    custumerEmail: {
        type: String,
    },
    custumerNumber: {
        type: String,
    },
    custumerMobile: {
        type: String,
    },
    custumerDocument: {
        type: String,
    },
    billingAddress: {
        type: String,
    },
    billingNumber: {
        type: String,
    },
    billingNeighborhood: {
        type: String,
    },
    billingCity: {
        type: String,
    },
    billingState: {
        type: String,
    },
    billingZipCode: {
        type: String,
    },
},
    { timestamps: true })

export default mongoose.model("Transaction", transactionSchema);