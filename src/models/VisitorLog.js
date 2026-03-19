import mongoose from "mongoose";

const visitorLogSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true
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
      uppercase: true,
      trim: true
    },

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
      default: "PENDING",
      index: true
    },

    checkInAt: Date,
    checkOutAt: Date,

    entryType: {
      type: String,
      enum: ["VISITOR", "DELIVERY", "EMERGENCY", "GUEST"],
      default: "VISITOR",
      index: true
    },

    deliveryCompany: String,
    parcelType: String,

    /* =====================================================
       🔐 OTP SYSTEM
    ===================================================== */

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
   🔥 INDEXES
===================================================== */

// Society visitor listing
visitorLogSchema.index({ societyId: 1, createdAt: -1 });

// Status filtering
visitorLogSchema.index({ societyId: 1, status: 1 });

// 🔥 Flat-based lookup (NEW)
visitorLogSchema.index({ societyId: 1, flatId: 1, status: 1 });

// Guard logs
visitorLogSchema.index({ guardId: 1, createdAt: -1 });

// Entry type filtering
visitorLogSchema.index({ societyId: 1, entryType: 1 });

// OTP lookup
visitorLogSchema.index({ otp: 1, otpStatus: 1 });

export default mongoose.model("VisitorLog", visitorLogSchema);