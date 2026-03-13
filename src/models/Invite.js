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
      required: true
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    /**
     * ===============================
     * 🏢 WING SUPPORT
     * ===============================
     */

    wing: {
      type: String,
      required: function () {
        return (
          this.roles?.includes("OWNER") ||
          this.roles?.includes("TENANT")
        );
      },
      uppercase: true,
      trim: true
    },

    flatNo: {
      type: String,
      required: function () {
        return (
          this.roles?.includes("OWNER") ||
          this.roles?.includes("TENANT")
        );
      }
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
      type: String, // example: "08:00"
      required: function () {
        return this.roles?.includes("GUARD");
      }
    },

    shiftEndTime: {
      type: String, // example: "20:00"
      required: function () {
        return this.roles?.includes("GUARD");
      }
    },

    status: {
      type: String,
      enum: ["PENDING", "USED", "EXPIRED"],
      default: "PENDING"
    },

    expiresAt: {
      type: Date,
      required: true
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

// Expiry cleanup
inviteSchema.index({ expiresAt: 1 });

// Guard shift search
inviteSchema.index({ societyId: 1, shiftType: 1 });

// 🔥 Wing-based resident search
inviteSchema.index({ societyId: 1, wing: 1, flatNo: 1 });

export default mongoose.model("Invite", inviteSchema);