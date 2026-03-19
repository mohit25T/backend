import mongoose from "mongoose";

const flatSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true, // 🔥 IMPORTANT
    },

    wing: {
      type: String,
      required: true,
      index: true,
      uppercase: true,
      trim: true,
    },

    flatNo: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    // 🔥 NEW: Occupancy Tracking
    isOccupied: {
      type: Boolean,
      default: false,
      index: true,
    },

    occupiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    occupiedFrom: {
      type: Date,
      default: null,
      index: true,
    },

    // 🔥 NEW: Subscription Access Control (MOST IMPORTANT)
    isSubscribed: {
      type: Boolean,
      default: false, // ❗ new flats won't be allowed automatically
      index: true,
    },
  },
  { timestamps: true }
);


// 🔥 Unique flat per society
flatSchema.index(
  { societyId: 1, wing: 1, flatNo: 1 },
  { unique: true }
);


// 🔥 Fast queries (subscription + usage checks)
flatSchema.index({
  societyId: 1,
  isSubscribed: 1,
});


// 🔥 Occupancy-based queries
flatSchema.index({
  societyId: 1,
  isOccupied: 1,
});


export default mongoose.model("Flat", flatSchema);