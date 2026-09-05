const Report = require("../models/report");
const Flag = require("../models/flag");

// GET /api/moderation/reports/pending
const getPendingReports = async (req, res) => {
    try {
        const reports = await Report.find({ status: "pending" })
            .populate("reportedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(reports);
    } catch (err) {
        console.log("Get Pending Reports Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/moderation/reports/:id/approve
const approveReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        report.status = "approved";
        await report.save();

        res.status(200).json({ message: "Report approved", report });
    } catch (err) {
        console.log("Approve Report Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/moderation/reports/:id/reject
const rejectReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        report.status = "rejected";
        await report.save();

        res.status(200).json({ message: "Report rejected", report });
    } catch (err) {
        console.log("Reject Report Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/moderation/flags/pending
const getPendingFlags = async (req, res) => {
    try {
        const flags = await Flag.find({ status: "pending" })
            .populate("report")
            .populate("flaggedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(flags);
    } catch (err) {
        console.log("Get Pending Flags Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/moderation/flags/:id/resolve
const resolveFlag = async (req, res) => {
    try {
        const flag = await Flag.findById(req.params.id);
        if (!flag) {
            return res.status(404).json({ message: "Flag not found" });
        }

        const report = await Report.findById(flag.report);
        if (!report) {
            return res.status(404).json({ message: "Linked report not found" });
        }

        // Hide report from map, send it back to the submitter with the reason
        report.status = "under_review";
        report.reviewNote = flag.reason;
        await report.save();

        flag.status = "resolved";
        await flag.save();

        res.status(200).json({ message: "Flag resolved, report sent back for review", report, flag });
    } catch (err) {
        console.log("Resolve Flag Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/moderation/flags/:id/dismiss
const dismissFlag = async (req, res) => {
    try {
        const flag = await Flag.findById(req.params.id);
        if (!flag) {
            return res.status(404).json({ message: "Flag not found" });
        }

        flag.status = "dismissed";
        await flag.save();

        res.status(200).json({ message: "Flag dismissed, report remains live", flag });
    } catch (err) {
        console.log("Dismiss Flag Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getPendingReports,
    approveReport,
    rejectReport,
    getPendingFlags,
    resolveFlag,
    dismissFlag,
};