import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    priority: {
      type: String,
      enum: ["NORMAL", "IMPORTANT", "URGENT"],
      default: "NORMAL",
      index: true
    },

    expiresAt: {
      type: Date,
      index: true
    }
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */

// Society feed sorting
noticeSchema.index({ societyId: 1, createdAt: -1 });

// Expiry filtering
noticeSchema.index({ societyId: 1, expiresAt: 1 });

// Priority filtering
noticeSchema.index({ societyId: 1, priority: 1 });

export default mongoose.model("Notice", noticeSchema);