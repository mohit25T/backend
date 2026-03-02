import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
    {
        societyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Society",
            required: true,
            index: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        flatNo: {
            type: String,
            required: true,
            index: true
        },

        category: {
            type: String,
            enum: ["PLUMBING", "ELECTRICITY", "SECURITY", "CLEANING", "LIFT", "OTHER"],
            required: true,
            index: true
        },

        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "MEDIUM",
            index: true
        },

        title: {
            type: String,
            required: true
        },

        description: String,

        images: {
            type: [String],
            default: []
        },

        status: {
            type: String,
            enum: ["OPEN", "IN_PROGRESS", "RESOLVED"],
            default: "OPEN",
            index: true
        },

        adminResponse: String,

        resolvedAt: {
            type: Date,
            index: true
        }
    },
    { timestamps: true }
);

/* ================= INDEXES ================= */

// Admin filtering by status
complaintSchema.index({ societyId: 1, status: 1 });

// Resident "My Complaints"
complaintSchema.index({ userId: 1, createdAt: -1 });

// Society dashboard sorting
complaintSchema.index({ societyId: 1, createdAt: -1 });

// Priority filtering
complaintSchema.index({ societyId: 1, priority: 1 });

export default mongoose.model("Complaint", complaintSchema);