const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        location: {
            lat: {
                type: Number,
                required: true,
            },
            lng: {
                type: Number,
                required: true,
            },
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
        },
        time: {
            type: String,
            enum: ["Morning", "Afternoon", "Evening", "Night"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "under_review"],
            default: "pending",
        },
        reviewNote: {
            type: String,
            default: "",
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);