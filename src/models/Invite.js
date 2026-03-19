import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    mobile: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    roles: {
      type: [String],
      enum: ["ADMIN", "OWNER", "TENANT", "GUARD"],
      required: true
    },

    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    /**
     * ===============================
     * 🏢 FLAT LINK (FIXED ✅)
     * ===============================
     */

    flatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      required: false, // ✅ IMPORTANT FIX
      index: true
    },

    // For invite stage (before flat exists)
    wing: {
      type: String,
      uppercase: true,
      trim: true
    },

    flatNo: {
      type: String,
      trim: true
    },

    /**
     * ===============================
     * GUARD SHIFT DATA
     * ===============================
     */

    shiftType: {
      type: String,
      enum: ["DAY", "NIGHT"],
      required: function () {
        return this.roles?.includes("GUARD");
      }
    },

    shiftStartTime: {
      type: String,
      required: function () {
        return this.roles?.includes("GUARD");
      }
    },

    shiftEndTime: {
      type: String,
      required: function () {
        return this.roles?.includes("GUARD");
      }
    },

    status: {
      type: String,
      enum: ["PENDING", "USED", "EXPIRED"],
      default: "PENDING",
      index: true
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true
    }
  },
  { timestamps: true }
);


/* =====================================================
   🔥 PRODUCTION INDEXES
===================================================== */

// OTP verification lookup
inviteSchema.index({
  mobile: 1,
  roles: 1,
  status: 1,
  expiresAt: 1
});

// Society invite listing
inviteSchema.index({ societyId: 1, createdAt: -1 });

// Admin tracking
inviteSchema.index({ invitedBy: 1 });

// Guard shift search
inviteSchema.index({ societyId: 1, shiftType: 1 });

// Flat-based lookup (optional now)
inviteSchema.index({ societyId: 1, flatId: 1 });

export default mongoose.model("Invite", inviteSchema);