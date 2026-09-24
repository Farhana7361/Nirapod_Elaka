const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        report: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report",
        },
        type: {
           type: String,
           enum: ["approved", "rejected", "under_review"],
           required: true,
      },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);