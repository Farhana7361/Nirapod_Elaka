const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createReport,
    getApprovedReports,
    getMyReports,
    updateMyReport,
    toggleLike,
} = require("../controllers/reportController");
const { createComment, getComments } = require("../controllers/commentController");

router.post("/", protect, createReport);
router.get("/approved", getApprovedReports); // public, no protect
router.get("/mine", protect, getMyReports);
router.put("/:id", protect, updateMyReport);
router.put("/:id/like", protect, toggleLike);
router.post("/:id/comments", protect, createComment);
router.get("/:id/comments", getComments); // public, no protect

module.exports = router;