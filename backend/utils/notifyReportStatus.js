const Notification = require("../models/Notification");
const User = require("../models/User");

// Creates a notification for the report's owner when its status changes.
const notifyReportStatus = async (report) => {
    try {
        const label = `"${report.type || "Incident"}" at ${report.address || "Location"}`;
        let message;

        if (report.status === "approved") {
            message = `Your report ${label} was approved and is now visible to the community.`;
        } else if (report.status === "rejected") {
            message = `Your report ${label} was rejected.${
                report.reviewNote ? ` Admin note: ${report.reviewNote}` : ""
            }`;
        } else if (report.status === "under_review" || report.status === "review") {
            message = `Your report ${label} was sent back for review.${
                report.reviewNote ? ` Reason: ${report.reviewNote}` : ""
            } Please update it and resubmit.`;
        } else {
            return; // pending or anything else: no user notification
        }

        const targetUserId = report.reportedBy?._id || report.reportedBy;
        if (!targetUserId) {
            console.log("[notifyReportStatus] No reportedBy found on report", report._id);
            return;
        }

        const notif = await Notification.create({
            user: targetUserId,
            report: report._id,
            type: report.status,
            message,
        });
        console.log(`[notifyReportStatus] Created user notification [${report.status}] for user ${targetUserId}:`, notif._id);
    } catch (err) {
        console.error("[notifyReportStatus] Error:", err);
    }
};

// Creates notifications for all admins when a new report is submitted or updated for review
const notifyAdminsReportReview = async (report, eventType = "new") => {
    try {
        const admins = await User.find({ role: { $regex: /^admin$/i } });
        console.log(`[notifyAdminsReportReview] Found ${admins ? admins.length : 0} admin(s) in database for event [${eventType}]`);
        if (!admins || admins.length === 0) {
            console.log("[notifyAdminsReportReview] No admin found with role='admin'");
            return;
        }

        const label = `"${report.type || "Incident"}" at ${report.address || "Location"}`;
        const message =
            eventType === "updated"
                ? `Report updated and resubmitted for admin review: ${label}`
                : `New report submitted for admin review: ${label}`;

        const notifType = eventType === "updated" ? "review" : "new_report";

        for (const admin of admins) {
            const created = await Notification.create({
                user: admin._id,
                report: report._id,
                type: notifType,
                message,
            });
            console.log(`[notifyAdminsReportReview] Created notification ${created._id} for admin ${admin._id} (${admin.email})`);
        }
    } catch (err) {
        console.error("[notifyAdminsReportReview] Error:", err);
    }
};

module.exports = {
    notifyReportStatus,
    notifyAdminsReportReview,
};