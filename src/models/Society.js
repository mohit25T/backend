import mongoose from "mongoose";

const societySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    city: {
      type: String,
      trim: true
    },

    /* =====================================================
       🏢 WINGS
    ===================================================== */
    wings: [
      {
        type: String,
        trim: true
      }
    ],

    /* =====================================================
       🔥 NEW: TOTAL FLATS (CRITICAL FOR BILLING)
    ===================================================== */
    totalFlats: {
      type: Number,
      default: 0
    },

    /* =====================================================
       🔒 OPTIONAL: LOCK AFTER SUBSCRIPTION
    ===================================================== */
    isFlatLimitLocked: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED"],
      default: "ACTIVE",
      index: true
    }
  },
  { timestamps: true }
);


/* =====================================================
   🔥 INDEXES
===================================================== */

societySchema.index({ status: 1 });
societySchema.index({ createdBy: 1 });
societySchema.index({ city: 1 });
societySchema.index({ name: 1 });
societySchema.index({ city: 1, status: 1 });


export default mongoose.model("Society", societySchema);