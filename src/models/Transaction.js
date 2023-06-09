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
        enum: [ "billet","credit_card" ]
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
    customerEmail: {
        type: String,
    },
    customerNumber: {
        type: String,
    },
    customerMobile: {
        type: String,
    },
    customerDocument: {
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