import mongoose from "mongoose";

const guardLoginLogSchema = new mongoose.Schema(
  {
    guardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true
    },

    /* =====================================================
       🏢 WING ASSIGNMENT
    ===================================================== */

    wing: {
      type: String,
      uppercase: true,
      trim: true,
      default: null // null = main gate / entire society
    },

    loginAt: {
      type: Date,
      default: Date.now
    },

    logoutAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */

// Guard activity
guardLoginLogSchema.index({ guardId: 1, createdAt: -1 });

// Society guard logs
guardLoginLogSchema.index({ societyId: 1, createdAt: -1 });

// Wing-based guard tracking
guardLoginLogSchema.index({ societyId: 1, wing: 1 });

export default mongoose.model("GuardLoginLog", guardLoginLogSchema);