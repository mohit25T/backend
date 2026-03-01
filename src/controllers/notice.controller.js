import Notice from "../models/Notice.js";
import User from "../models/User.js";
import {
    sendPushNotificationToMany
} from "../services/notificationService.js";

/* ===============================
   🔧 Helper
=============================== */
const getUserTokens = (user) => {
    if (!user) return [];
    if (Array.isArray(user.fcmTokens)) return user.fcmTokens;
    return [];
};

/* ===============================
   1️⃣ CREATE NOTICE
   🔔 Notify Entire Society
=============================== */
export const createNotice = async (req, res) => {
    try {
        const admin = await User.findById(req.user.userId);

        if (!admin || !admin.roles.includes("ADMIN")) {
            return res.status(403).json({
                message: "Only admin allowed"
            });
        }

        const { title, message, priority, expiresAt } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                message: "Title and message required"
            });
        }

        const notice = await Notice.create({
            societyId: admin.societyId,
            createdBy: admin._id,
            title,
            message,
            priority,
            expiresAt: expiresAt ? new Date(expiresAt) : null
        });

        /* ===============================
           🔔 Notify All Active Users
        =============================== */
        try {
            const users = await User.find({
                societyId: admin.societyId,
                status: "ACTIVE"
            });

            const allTokens = users.flatMap(user =>
                getUserTokens(user)
            );

            if (allTokens.length > 0) {
                await sendPushNotificationToMany(
                    allTokens,
                    "New Notice 📢",
                    title,
                    {
                        type: "NOTICE_CREATED",
                        noticeId: notice._id.toString()
                    }
                );
            }

        } catch (pushError) {
            console.error("Notice Push Error:", pushError);
        }

        return res.status(201).json({
            success: true,
            message: "Notice created successfully",
            data: notice
        });

    } catch (err) {
        console.error("CREATE NOTICE ERROR:", err);
        return res.status(500).json({
            message: "Failed to create notice"
        });
    }
};


/* ===============================
   2️⃣ GET NOTICES
=============================== */
export const getNotices = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        const notices = await Notice.find({
            societyId: user.societyId,
            $or: [
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } }
            ]
        }).sort({ createdAt: -1 });

        return res.json({
            success: true,
            data: notices
        });

    } catch (err) {
        console.error("GET NOTICE ERROR:", err);
        return res.status(500).json({
            message: "Failed to fetch notices"
        });
    }
};


/* ===============================
   3️⃣ DELETE NOTICE
=============================== */
export const deleteNotice = async (req, res) => {
    try {
        const admin = await User.findById(req.user.userId);

        if (!admin || !admin.roles.includes("ADMIN")) {
            return res.status(403).json({
                message: "Only admin allowed"
            });
        }

        const notice = await Notice.findById(req.params.id);

        if (!notice) {
            return res.status(404).json({
                message: "Notice not found"
            });
        }

        if (
            notice.societyId.toString() !==
            admin.societyId.toString()
        ) {
            return res.status(403).json({
                message: "Unauthorized action"
            });
        }

        await notice.deleteOne();

        return res.json({
            success: true,
            message: "Notice deleted successfully"
        });

    } catch (err) {
        console.error("DELETE NOTICE ERROR:", err);
        return res.status(500).json({
            message: "Failed to delete notice"
        });
    }
};