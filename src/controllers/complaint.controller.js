import Complaint from "../models/Complaint.js";
import User from "../models/User.js";

/* ================= CREATE ================= */
export const createComplaint = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const { category, priority, title, description } = req.body;

        const complaint = await Complaint.create({
            societyId: user.societyId,
            userId: user._id,
            flatNo: user.flatNo,
            category,
            priority,
            title,
            description,
            image: req.file ? req.file.path : null // 🔥 Cloudinary URL
        });

        return res.json({
            success: true,
            message: "Complaint submitted successfully",
            data: complaint
        });

    } catch (err) {
        console.error("CREATE COMPLAINT ERROR:", err);
        return res.status(500).json({
            message: "Failed to submit complaint"
        });
    }
};

/* ================= RESIDENT ================= */
export const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            userId: req.user.userId
        }).sort({ createdAt: -1 });

        return res.json({
            success: true,
            data: complaints
        });

    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch complaints" });
    }
};

/* ================= ADMIN ================= */
export const getAllComplaints = async (req, res) => {
    try {
        const admin = await User.findById(req.user.userId);

        if (!admin.roles.includes("ADMIN")) {
            return res.status(403).json({ message: "Only admin allowed" });
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
        return res.status(500).json({ message: "Failed to fetch complaints" });
    }
};

/* ================= UPDATE STATUS ================= */
export const updateComplaintStatus = async (req, res) => {
    try {
        const admin = await User.findById(req.user.userId);

        if (!admin.roles.includes("ADMIN")) {
            return res.status(403).json({ message: "Only admin allowed" });
        }

        const { status, adminResponse } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        complaint.status = status;

        if (adminResponse) {
            complaint.adminResponse = adminResponse;
        }

        if (status === "RESOLVED") {
            complaint.resolvedAt = new Date();
        }

        await complaint.save();

        return res.json({
            success: true,
            message: "Complaint updated",
            data: complaint
        });

    } catch (err) {
        return res.status(500).json({ message: "Failed to update complaint" });
    }
};