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

    /* ✅ ADD THIS */
    wings: [
      {
        type: String,
        trim: true
      }
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED"],
      default: "ACTIVE"
    }
  },
  { timestamps: true }
);

/* =====================================================
   🔥 PRODUCTION INDEXES
===================================================== */

societySchema.index({ status: 1 });
societySchema.index({ createdBy: 1 });
societySchema.index({ city: 1 });
societySchema.index({ name: 1 });
societySchema.index({ city: 1, status: 1 });

export default mongoose.model("Society", societySchema);