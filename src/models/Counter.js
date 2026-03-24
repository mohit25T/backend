import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    // 🔥 Scope per society
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },

    // 🔥 Counter type (scalable for future)
    type: {
      type: String,
      default: "flat",
      enum: ["flat"], // extend later if needed
    },

    // 🔥 Counter value
    value: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


// ===============================
// 🔥 UNIQUE INDEX (CRITICAL)
// ===============================
// One counter per society per type
counterSchema.index(
  { societyId: 1, type: 1 },
  { unique: true }
);


// ===============================
// 🔍 FAST LOOKUP INDEX
// ===============================
counterSchema.index({
  societyId: 1,
});


// ===============================
// 🔍 OPTIONAL DEBUG INDEX
// ===============================
counterSchema.index({
  societyId: 1,
  value: -1,
});


export default mongoose.model("Counter", counterSchema);