import mongoose from "mongoose";

const societySettingsSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      unique: true
    },

    /* =====================================================
       🚗 VEHICLE MANAGEMENT SETTINGS
    ===================================================== */

    vehicleSettings: {
      maxVehiclesPerFlat: {
        type: Number,
        default: 2
      },

      requireParkingSlot: {
        type: Boolean,
        default: false
      },

      requireAdminApproval: {
        type: Boolean,
        default: false
      }
    },

    /* =====================================================
       🧹 HELPER MANAGEMENT SETTINGS
    ===================================================== */

    helperSettings: {
      requirePhoto: {
        type: Boolean,
        default: false
      },

      allowMultipleFlats: {
        type: Boolean,
        default: true
      }
    },

    /* =====================================================
       🚨 SOS SETTINGS
    ===================================================== */

    sosSettings: {
      enableSOS: {
        type: Boolean,
        default: true
      },

      sosCooldownMinutes: {
        type: Number,
        default: 5
      },

      // 🔔 Notify neighbors
      notifyNeighbors: {
        type: Boolean,
        default: true
      },

      // 📏 How many nearby flats should get alert
      neighborRange: {
        type: Number,
        default: 2
      },

      // 👮 Notify guards
      notifyGuards: {
        type: Boolean,
        default: true
      },

      // 🏢 Notify wing admin
      notifyWingAdmin: {
        type: Boolean,
        default: true
      }
    }
  },
  { timestamps: true }
);

/* =====================================================
   🔥 INDEXING
===================================================== */

// Fast lookup by society
societySettingsSchema.index({ societyId: 1 });

export default mongoose.model("SocietySettings", societySettingsSchema);