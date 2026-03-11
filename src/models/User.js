import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,

    mobile: {
      type: String,
      unique: true,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    roles: {
      type: [String],
      enum: [
        "SUPER_ADMIN",
        "ADMIN",
        "OWNER",
        "TENANT",
        "GUARD"
      ],
      required: true
    },

    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society"
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED", "PENDING_VERIFICATION", "INACTIVE"],
      default: "ACTIVE"
    },

    profileImage: {
      type: String,
      default: null
    },

    isProfileComplete: {
      type: Boolean,
      default: false
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

    fcmTokens: {
      type: [String],
      default: []
    },

    fcmUpdatedAt: {
      type: Date,
      default: null
    },

    /* =====================================================
       🔐 AUTH SESSION MANAGEMENT
    ===================================================== */

    refreshToken: {
      type: String,
      default: null
    },

    /* =====================================================
       🔥 FULL YEAR MAINTENANCE TRACKING
    ===================================================== */

    fullYearPaidYears: {
      type: [Number],
      default: []
    },

    /* =====================================================
       🛡️ GUARD SHIFT MANAGEMENT
    ===================================================== */

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

    isOnDuty: {
      type: Boolean,
      default: false
    }

  },
  { timestamps: true }
);

/* =====================================================
   🔥 PRODUCTION OPTIMIZED INDEXES
===================================================== */

userSchema.index({ societyId: 1 });
userSchema.index({ societyId: 1, roles: 1 });
userSchema.index({ societyId: 1, flatNo: 1 });
userSchema.index({ invitedBy: 1 });
userSchema.index({ societyId: 1, status: 1 });
userSchema.index({ roles: 1 });
userSchema.index({ societyId: 1, fullYearPaidYears: 1 });

// 🔥 Guard shift lookup
userSchema.index({ societyId: 1, shiftType: 1 });

export default mongoose.model("User", userSchema);