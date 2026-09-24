const Notification = require("../models/Notification");

// GET /api/notifications
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            user: req.user._id,
            isRead: false,
        });

        res.status(200).json({ notifications, unreadCount });
    } catch (err) {
        console.log("Get Notifications Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/notifications/read-all
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, isRead: false },
            { isRead: true }
        );
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (err) {
        console.log("Mark All Read Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json(notification);
    } catch (err) {
        console.log("Mark Read Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getMyNotifications, markAllAsRead, markAsRead };