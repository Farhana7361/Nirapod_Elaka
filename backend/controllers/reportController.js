const Report = require("../models/report");

// POST /api/reports
const createReport = async (req, res) => {
    try {
        const { type, description, lat, lng, rating, time } = req.body;

        if (!type || !description || lat === undefined || lng === undefined || rating === undefined || !time) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (rating < 0 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 0 and 5" });
        }

        const report = await Report.create({
            type,
            description,
            location: { lat, lng },
            rating,
            time,
            reportedBy: req.user._id,
        });

        res.status(201).json(report);
    } catch (err) {
        console.log("Create Report Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/reports/approved
const getApprovedReports = async (req, res) => {
    try {
        const reports = await Report.find({ status: "approved" });
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

        const { type, description, lat, lng, rating, time } = req.body;

        if (type) report.type = type;
        if (description) report.description = description;
        if (lat !== undefined) report.location.lat = lat;
        if (lng !== undefined) report.location.lng = lng;
        if (rating !== undefined) report.rating = rating;
        if (time) report.time = time;

        report.status = "pending";
        report.reviewNote = "";

        await report.save();

        res.status(200).json(report);
    } catch (err) {
        console.log("Update Report Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createReport, getApprovedReports, getMyReports, updateMyReport };