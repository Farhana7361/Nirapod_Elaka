const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createReport,
    getApprovedReports,
    getMyReports,
    updateMyReport,
} = require("../controllers/reportController");

router.post("/", protect, createReport);
router.get("/approved", getApprovedReports); // public, no protect
router.get("/mine", protect, getMyReports);
router.put("/:id", protect, updateMyReport);

module.exports = router;