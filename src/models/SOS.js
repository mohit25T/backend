import mongoose from "mongoose";

const sosSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true
    },

    /* =====================================================
       🏢 FLAT LINK (🔥 IMPORTANT CHANGE)
    ===================================================== */

    flatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      required: true,
      index: true
    },

    // Optional (for UI display)
    wing: {
      type: String,
      required: true,
      index: true
    },

    flatNo: {
      type: String,
      required: true
    },

    emergencyType: {
      type: String,
      enum: ["medical", "fire", "security"],
      default: "security",
      index: true
    },

    status: {
      type: String,
      enum: ["active", "responding", "resolved"],
      default: "active",
      index: true
    },

    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },

    resolvedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);


// Compound index for fast guard dashboard queries
sosSchema.index({ societyId: 1, status: 1 });

// Index for checking active SOS per user
sosSchema.index({ userId: 1, status: 1 });

// Index for admin history filtering
sosSchema.index({ societyId: 1, createdAt: -1 });

// 🔥 Flat-based lookup (NEW)
sosSchema.index({ societyId: 1, flatId: 1 });

export default mongoose.model("SOS", sosSchema);