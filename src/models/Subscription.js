import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },

    plan: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
      index: true,
    },

    pricePerFlat: {
      type: Number,
      default: 20,
    },

    /**
     * 🔥 ACTUAL FLATS AT PURCHASE (for record only)
     */
    totalFlats: {
      type: Number,
      required: true,
    },

    /**
     * 🔒 MOST IMPORTANT FIELD (LOOPHOLE FIX)
     * Allowed flats under this subscription
     */
    allowedFlats: {
      type: Number,
      required: true,
      index: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
      index: true,
    },

    endDate: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);


// 🔥 COMPOUND INDEX
subscriptionSchema.index({
  societyId: 1,
  status: 1,
  endDate: -1,
});


// 🔥 Only ONE active subscription
subscriptionSchema.index(
  { societyId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "active" },
  }
);


// 🔥 Latest subscription lookup
subscriptionSchema.index({
  societyId: 1,
  createdAt: -1,
});

export default mongoose.model("Subscription", subscriptionSchema);