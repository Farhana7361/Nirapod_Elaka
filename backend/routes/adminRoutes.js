const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
    getStats,
    getUsers,
    getReports,
    deleteUser,
    updateUserRole,
    updateReportStatus,
} = require("../controllers/adminController");

// All routes require authentication and admin privileges
router.use(protect, adminOnly);

// Stats
router.get("/stats", getStats);

// Users Management
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/role", updateUserRole);

// Reports Management
router.get("/reports", getReports);
router.put("/reports/:id/status", updateReportStatus);

module.exports = router;
