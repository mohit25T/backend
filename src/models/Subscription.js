import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true, // 🔥 MUST for multi-tenant
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

    totalFlats: {
      type: Number,
      required: true,
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
      index: true, // 🔥 expiry checks
    },

    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
      index: true, // 🔥 frequent filter
    },
  },
  { timestamps: true }
);


// 🔥 COMPOUND INDEX (MOST IMPORTANT)
subscriptionSchema.index({
  societyId: 1,
  status: 1,
  endDate: -1,
});


// 🔥 Ensure only ONE active subscription per society
subscriptionSchema.index(
  { societyId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "active" },
  }
);


// 🔥 Fast lookup for latest subscription
subscriptionSchema.index({
  societyId: 1,
  createdAt: -1,
});

export default mongoose.model("Subscription", subscriptionSchema);