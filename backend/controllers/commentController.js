const Comment = require("../models/Comment");
const Report = require("../models/Report");

// POST /api/reports/:id/comments
const createComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const comment = await Comment.create({
            report: report._id,
            user: req.user._id,
            text: text.trim(),
        });

        const populated = await comment.populate("user", "name");
        res.status(201).json(populated);
    } catch (err) {
        console.log("Create Comment Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/reports/:id/comments
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ report: req.params.id })
            .populate("user", "name")
            .sort({ createdAt: 1 });
        res.status(200).json(comments);
    } catch (err) {
        console.log("Get Comments Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/comments/:id
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const isOwner = comment.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "You can only delete your own comments" });
        }

        await comment.deleteOne();
        res.status(200).json({ message: "Comment deleted" });
    } catch (err) {
        console.log("Delete Comment Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createComment, getComments, deleteComment };