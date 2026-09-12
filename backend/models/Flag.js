const mongoose = require("mongoose");

const flagSchema = new mongoose.Schema(
    {
        report: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report",
            required: true,
        },
        flaggedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "resolved", "dismissed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Flag", flagSchema);