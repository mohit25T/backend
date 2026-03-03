import mongoose from "mongoose";

const visitorLogSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true
    },

    visitorPhoto: {
      type: String,
      default: null
    },

    // 🔹 Visitor info
    personName: {
      type: String,
      required: true
    },

    personMobile: String,
    purpose: String,
    vehicleNo: String,

    // 🏠 Flat info (CORE LINK)
    flatNo: {
      type: String,
      required: true
    },
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    // 👮 Guard
    guardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    // 🔁 Visitor flow
    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "ENTERED",
        "EXITED"
      ],
      default: "PENDING"
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    checkInAt: Date,
    checkOutAt: Date,

    entryType: {
      type: String,
      enum: ["VISITOR", "DELIVERY", "EMERGENCY", "GUEST"],
      default: "VISITOR"
    },

    deliveryCompany: String,
    parcelType: String,

    // 🔐 OTP system
    otp: String,

    otpStatus: {
      type: String,
      enum: ["ACTIVE", "USED", "EXPIRED"],
      default: "ACTIVE"
    },

    otpExpiresAt: Date,

    createdByResident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }

  },
  { timestamps: true }
);

/* =====================================================
   🔥 PRODUCTION OPTIMIZED INDEXES (FLAT-BASED)
===================================================== */

// Main society listing
visitorLogSchema.index({ societyId: 1, createdAt: -1 });

// Status filtering
visitorLogSchema.index({ societyId: 1, status: 1 });

// Flat-based pending list (VERY IMPORTANT)
visitorLogSchema.index({ societyId: 1, flatNo: 1, status: 1 });

// Guard logs
visitorLogSchema.index({ guardId: 1, createdAt: -1 });

// Entry type filtering
visitorLogSchema.index({ societyId: 1, entryType: 1 });

// OTP lookup
visitorLogSchema.index({ otp: 1, otpStatus: 1 });

export default mongoose.model("VisitorLog", visitorLogSchema);