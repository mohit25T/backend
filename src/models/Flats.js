import mongoose from "mongoose";

const flatSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
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

    // 🔥 Occupancy Tracking
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

    // 🔥 Subscription Access Control (CRITICAL)
    isSubscribed: {
      type: Boolean,
      default: false, // ❗ IMPORTANT: new flats are NOT auto-allowed
      index: true,
    },

    // 🔥 NEW: Flat Order Tracking (VERY IMPORTANT FOR LIMIT SYSTEM)
    flatIndex: {
      type: Number,
      required: true,
      index: true,
    },

    // 🔥 NEW: Whether this flat is within subscription limit
    isWithinLimit: {
      type: Boolean,
      default: false,
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


// 🔥 NEW: Index for limit-based access
flatSchema.index({
  societyId: 1,
  flatIndex: 1,
});


// 🔥 AUTO-INCREMENT flatIndex per society
flatSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastFlat = await mongoose.model("Flat").findOne(
      { societyId: this.societyId },
      {},
      { sort: { flatIndex: -1 } }
    );

    this.flatIndex = lastFlat ? lastFlat.flatIndex + 1 : 1;
  }

  next();
});


export default mongoose.model("Flat", flatSchema);