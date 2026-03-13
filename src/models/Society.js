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

// Dashboard active societies
societySchema.index({ status: 1 });

// Societies created by super admin
societySchema.index({ createdBy: 1 });

// City filtering
societySchema.index({ city: 1 });

// Society search
societySchema.index({ name: 1 });

// Optional compound index
societySchema.index({ city: 1, status: 1 });

export default mongoose.model("Society", societySchema);