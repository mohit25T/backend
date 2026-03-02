import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import {
    sendPushNotificationToMany
} from "../services/notificationService.js";

/* ===============================
   🔧 Helper: Get valid FCM tokens
=============================== */
const getUserTokens = (user) => {
    if (!user) return [];
    if (Array.isArray(user.fcmTokens)) return user.fcmTokens;
    return [];
};

/* ===============================
   1️⃣ CREATE COMPLAINT
   🔔 Notify Admins
   📸 Supports Multiple Images
=============================== */
export const createComplaint = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const { category, priority, title, description } = req.body;

        if (!category || !title) {
            return res.status(400).json({
                message: "Category and title are required"
            });
        }

        /* ===============================
           📸 Handle upload.any()
           Support Multiple Images
        =============================== */
        let complaintImages = [];

        if (req.files && req.files.length > 0) {
            complaintImages = req.files
                .filter(file => file.mimetype.startsWith("image/"))
                .map(file => file.path); // Cloudinary secure URLs
        }

        /* ===============================
           📝 Create Complaint
        =============================== */
        const complaint = await Complaint.create({
            societyId: user.societyId,
            userId: user._id,
            flatNo: user.flatNo,
            category,
            priority,
            title,
            description,
            images: complaintImages, // 🔥 Multiple images stored
            status: "OPEN"
        });

        /* ===============================
           🔔 Notify Admins
        =============================== */
        try {
            const admins = await User.find({
                societyId: user.societyId,
                roles: "ADMIN",
                status: "ACTIVE"
            });

            const allTokens = admins.flatMap(admin =>
                getUserTokens(admin)
            );

            if (allTokens.length > 0) {
                await sendPushNotificationToMany(
                    allTokens,
                    "New Complaint 📢",
                    `${title} - Flat ${user.flatNo}`,
                    {
                        type: "COMPLAINT_CREATED",
                        complaintId: complaint._id.toString()
                    }
                );
            }

        } catch (pushError) {
            console.error("Complaint Create Push Error:", pushError);
        }

        return res.status(201).json({
            success: true,
            message: "Complaint submitted successfully",
            data: complaint
        });

    } catch (err) {
        console.error("CREATE COMPLAINT ERROR:", err);
        return res.status(500).json({
            message: err.message || "Failed to submit complaint"
        });
    }
};


/* ===============================
   2️⃣ RESIDENT → MY COMPLAINTS
=============================== */
export const getMyComplaints = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const complaints = await Complaint.find({
            userId: user._id,
            societyId: user.societyId
        }).sort({ createdAt: -1 });

        return res.json({
            success: true,
            data: complaints
        });

    } catch (err) {
        console.error("GET MY COMPLAINT ERROR:", err);
        return res.status(500).json({
            message: "Failed to fetch complaints"
        });
    }
};


/* ===============================
   3️⃣ ADMIN → ALL COMPLAINTS
=============================== */
export const getAllComplaints = async (req, res) => {
    try {
        const admin = await User.findById(req.user.userId);

        if (!admin || !admin.roles.includes("ADMIN")) {
            return res.status(403).json({
                message: "Only admin allowed"
            });
        }

        const complaints = await Complaint.find({
            societyId: admin.societyId
        })
            .populate("userId", "name flatNo")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            data: complaints
        });

    } catch (err) {
        console.error("GET ALL COMPLAINT ERROR:", err);
        return res.status(500).json({
            message: "Failed to fetch complaints"
        });
    }
};


/* ===============================
   4️⃣ ADMIN → UPDATE STATUS
   🔔 Notify Resident
=============================== */
export const updateComplaintStatus = async (req, res) => {
    try {
        const admin = await User.findById(req.user.userId);

        if (!admin || !admin.roles.includes("ADMIN")) {
            return res.status(403).json({
                message: "Only admin allowed"
            });
        }

        const { status, adminResponse } = req.body;

        const allowedStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED"];

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status value"
            });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        /* 🔒 Society isolation check */
        if (
            complaint.societyId.toString() !==
            admin.societyId.toString()
        ) {
            return res.status(403).json({
                message: "Unauthorized action"
            });
        }

        if (status) {
            complaint.status = status;

            if (status === "RESOLVED") {
                complaint.resolvedAt = new Date();
            }
        }

        if (adminResponse !== undefined) {
            complaint.adminResponse = adminResponse;
        }

        await complaint.save();

        /* ===============================
           🔔 Notify Complaint Owner
        =============================== */
        try {
            const complaintOwner = await User.findById(complaint.userId);
            const tokens = getUserTokens(complaintOwner);

            if (tokens.length > 0) {
                await sendPushNotificationToMany(
                    tokens,
                    "Complaint Updated 🔄",
                    `Your complaint is now ${complaint.status}`,
                    {
                        type: "COMPLAINT_UPDATED",
                        complaintId: complaint._id.toString()
                    }
                );
            }

        } catch (pushError) {
            console.error("Complaint Update Push Error:", pushError);
        }

        return res.json({
            success: true,
            message: "Complaint updated successfully",
            data: complaint
        });

    } catch (err) {
        console.error("UPDATE COMPLAINT ERROR:", err);
        return res.status(500).json({
            message: "Failed to update complaint"
        });
    }
};