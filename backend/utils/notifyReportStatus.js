const Notification = require("../models/Notification");

// Creates a notification for the report's owner when its status changes.
// Never throws, so a failed notification can't break the moderation action.
const notifyReportStatus = async (report) => {
    try {
        const label = `"${report.type}" at ${report.address}`;
        let message;

        if (report.status === "approved") {
            message = `Your report ${label} was approved and is now visible to the community.`;
        } else if (report.status === "rejected") {
            message = `Your report ${label} was rejected.${
                report.reviewNote ? ` Admin note: ${report.reviewNote}` : ""
            }`;
        } else if (report.status === "under_review") {
            message = `Your report ${label} was sent back for review.${
                report.reviewNote ? ` Reason: ${report.reviewNote}` : ""
            } Please update it and resubmit.`;
        } else {
            return; // pending or anything else: no notification
        }

        await Notification.create({
            user: report.reportedBy,
            report: report._id,
            type: report.status,
            message,
        });
    } catch (err) {
        console.log("Notify Report Status Error:", err);
    }
};

module.exports = notifyReportStatus;