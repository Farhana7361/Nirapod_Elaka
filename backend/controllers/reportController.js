const Report = require("../models/Report");
const Comment = require("../models/Comment");
const { notifyAdminsReportReview } = require("../utils/notifyReportStatus");
// POST /api/reports
const createReport = async (req, res) => {
    try {
        const { type, description, lat, lng, address, rating, time } = req.body;

        if (!type || !description || lat === undefined || lng === undefined || !address || rating === undefined || !time) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (rating < 0 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 0 and 5" });
        }

        const report = await Report.create({
            type,
            description,
            location: { lat, lng },
            address,
            rating,
            time,
            reportedBy: req.user._id,
        });
        await notifyAdminsReportReview(report, "new");
        res.status(201).json(report);
    } catch (err) {
        console.log("Create Report Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/reports/approved
const getApprovedReports = async (req, res) => {
    try {
        const reports = await Report.find({ status: "approved" })
            .populate("reportedBy", "name")
            .sort({ createdAt: -1 });
        res.status(200).json(reports);
    } catch (err) {
        console.log("Get Approved Reports Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/reports/mine
const getMyReports = async (req, res) => {
    try {
        const reports = await Report.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(reports);
    } catch (err) {
        console.log("Get My Reports Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/reports/:id
const updateMyReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        if (report.reportedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only edit your own reports" });
        }

        const { type, description, lat, lng, address, rating, time } = req.body;

        if (type) report.type = type;
        if (description) report.description = description;
        if (lat !== undefined) report.location.lat = lat;
        if (lng !== undefined) report.location.lng = lng;
        if (address) report.address = address;
        if (rating !== undefined) report.rating = rating;
        if (time) report.time = time;

        report.status = "pending";
        report.reviewNote = "";

        await report.save();
        await notifyAdminsReportReview(report, "new");

        res.status(200).json(report);
    } catch (err) {
        console.log("Update Report Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/reports/:id/like
const toggleLike = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const userId = req.user._id.toString();
        const index = report.likes.findIndex((id) => id.toString() === userId);

        if (index === -1) {
            report.likes.push(req.user._id);
        } else {
            report.likes.splice(index, 1);
        }

        await report.save();

        res.status(200).json({ likes: report.likes, likeCount: report.likes.length });
    } catch (err) {
        console.log("Toggle Like Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/reports/:id
const deleteMyReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        if (report.reportedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only delete your own reports" });
        }

        // Remove this report's comments so they aren't left orphaned
        await Comment.deleteMany({ report: report._id });
        await report.deleteOne();

        res.status(200).json({ message: "Report deleted successfully" });
    } catch (err) {
        console.log("Delete Report Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createReport,
    getApprovedReports,
    getMyReports,
    updateMyReport,
    deleteMyReport,
    toggleLike,
};