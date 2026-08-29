const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    otpCode: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 900 // 15 minutes    
    }
}, {timestamps: true});

const otpModel = mongoose.model("iNotebook_otp_details", otpSchema);
module.exports = otpModel