import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    // 📱 Mobile stays mandatory
    mobile: {
      type: String,
      required: true
    },

    // 📧 Email added (required for email OTP)
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    role: {
      type: String,
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

    // 🏠 Flat number required for OWNER and TENANT
    flatNo: {
      type: String,
      required: function () {
        return this.role === "OWNER" || this.role === "TENANT";
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

export default mongoose.model("Invite", inviteSchema);