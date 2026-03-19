import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    /* =====================================================
       VEHICLE BASIC INFO
    ===================================================== */

    vehicleNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },

    vehicleType: {
      type: String,
      enum: ["CAR", "BIKE", "SCOOTER", "OTHER"],
      required: true
    },

    parkingSlot: {
      type: String,
      default: null
    },

    /* =====================================================
       VEHICLE OWNER
    ===================================================== */

    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
      uppercase: true,
      trim: true
    },

    flatNo: {
      type: String,
      required: true
    },

    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true
    },

    /* =====================================================
       VEHICLE STATUS
    ===================================================== */

    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED", "PENDING_APPROVAL"],
      default: "ACTIVE",
      index: true
    },

    /* =====================================================
       OPTIONAL VEHICLE DATA
    ===================================================== */

    stickerNumber: {
      type: String,
      default: null
    },

    notes: {
      type: String,
      default: null
    }

  },
  { timestamps: true }
);


/* =====================================================
   🔥 INDEXES
===================================================== */

// Search vehicle inside society
vehicleSchema.index({ societyId: 1, vehicleNumber: 1 });

// Resident vehicle lookup
vehicleSchema.index({ residentId: 1 });

// 🔥 Flat-based lookup (NEW)
vehicleSchema.index({ societyId: 1, flatId: 1 });

// Admin vehicle list
vehicleSchema.index({ societyId: 1, status: 1 });

// Parking lookup
vehicleSchema.index({ societyId: 1, parkingSlot: 1 });

// Unique vehicle per society
vehicleSchema.index(
  { societyId: 1, vehicleNumber: 1 },
  { unique: true }
);

export default mongoose.model("Vehicle", vehicleSchema);