import Notice from "../models/Notice.js";
import User from "../models/User.js";

/* ================= CREATE ================= */
export const createNotice = async (req, res) => {
    try {
        const admin = await User.findById(req.user.userId);

        if (!admin.roles.includes("ADMIN")) {
            return res.status(403).json({
                message: "Only admin allowed"
            });
        }

        const { title, message, priority, expiresAt } = req.body;

        const notice = await Notice.create({
            societyId: admin.societyId,
            createdBy: admin._id,
            title,
            message,
            priority,
            expiresAt
        });

        return res.json({
            success: true,
            message: "Notice created",
            data: notice
        });

    } catch (err) {
        console.error("CREATE NOTICE ERROR:", err);
        return res.status(500).json({
            message: "Failed to create notice"
        });
    }
};

/* ================= GET ================= */
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

/* ================= DELETE ================= */
export const deleteNotice = async (req, res) => {
    try {
        const admin = await User.findById(req.user.userId);

        if (!admin.roles.includes("ADMIN")) {
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

        // 🔒 Society validation (important)
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