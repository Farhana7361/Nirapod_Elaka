const User = require("../models/User");
const Report = require("../models/Report");
const { notifyReportStatus } = require("../utils/notifyReportStatus");

// GET /api/admin/stats
const getStats = async (req, res) => {
    try {
        const [totalUsers, totalAdmins, totalReports, safeAreasCount] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "admin" }),
            Report.countDocuments(),
            Report.countDocuments({ status: "approved" }),
        ]);

        res.status(200).json({
            stats: {
                totalUsers,
                totalAdmins,
                totalReports,
                safeAreasCount,
            },
            totalUsers,
            totalAdmins,
            totalReports,
            safeAreasCount,
        });
    } catch (err) {
        console.error("Admin Get Stats Error:", err);
        res.status(500).json({ message: "Server error fetching stats" });
    }
};

// GET /api/admin/users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        console.error("Admin Get Users Error:", err);
        res.status(500).json({ message: "Server error fetching users" });
    }
};

// GET /api/admin/reports
const getReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate("reportedBy", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json(reports);
    } catch (err) {
        console.error("Admin Get Reports Error:", err);
        res.status(500).json({ message: "Server error fetching reports" });
    }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user && req.user._id.toString() === id) {
            return res.status(400).json({ message: "You cannot delete your own admin account." });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Admin Delete User Error:", err);
        res.status(500).json({ message: "Server error deleting user" });
    }
};

// PUT /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !["user", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        if (req.user && req.user._id.toString() === id && role !== "admin") {
            return res.status(400).json({ message: "You cannot demote yourself from admin." });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            message: "User role updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                identity: user.identity,
            },
        });
    } catch (err) {
        console.error("Admin Update Role Error:", err);
        res.status(500).json({ message: "Server error updating user role" });
    }
};

const updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reviewNote } = req.body;

       if (!["approved", "rejected", "under_review", "review", "pending"].includes(status)) {
            return res.status(400).json({ message: "Invalid status specified" });
        }

        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const statusChanged = report.status !== status;

        report.status = status;
        report.reviewNote = reviewNote || "";
        await report.save();

        await notifyReportStatus(report);

        res.status(200).json({ message: "Report status updated successfully", report });
    } catch (err) {
        console.error("Admin Update Report Status Error:", err);
        res.status(500).json({ message: "Server error updating report status" });
    }
};

module.exports = {
    getStats,
    getUsers,
    getReports,
    deleteUser,
    updateUserRole,
    updateReportStatus,
};
