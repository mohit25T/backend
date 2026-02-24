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
        "OWNER",   // ✅ NEW
        "TENANT",  // ✅ NEW
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
      enum: ["ACTIVE", "BLOCKED", "PENDING_VERIFICATION"],
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

    /**
     * 🏠 Flat Number
     * Required for OWNER or TENANT
     */
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
     * 🔔 FCM TOKENS (MULTI DEVICE SUPPORT)
     */
    fcmTokens: {
      type: [String],
      default: []
    },

    /**
     * 🕒 Last time FCM token was updated
     */
    fcmUpdatedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);