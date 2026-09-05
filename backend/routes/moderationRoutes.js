const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
    getPendingReports,
    approveReport,
    rejectReport,
    getPendingFlags,
    resolveFlag,
    dismissFlag,
} = require("../controllers/moderationController");

router.get("/reports/pending", protect, adminOnly, getPendingReports);
router.put("/reports/:id/approve", protect, adminOnly, approveReport);
router.put("/reports/:id/reject", protect, adminOnly, rejectReport);

router.get("/flags/pending", protect, adminOnly, getPendingFlags);
router.put("/flags/:id/resolve", protect, adminOnly, resolveFlag);
router.put("/flags/:id/dismiss", protect, adminOnly, dismissFlag);

module.exports = router;