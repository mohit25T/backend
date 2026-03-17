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
    },
    flatNo: {
      type: String,
      required: true,
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


// 🔥 Fast count + queries
flatSchema.index({
  societyId: 1,
});

export default mongoose.model("Flat", flatSchema);