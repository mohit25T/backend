import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true, // 🔍 for search
    },
    phone: {
      type: String,
      required: true,
      index: true, // 🔍 fast lookup / dedupe
    },
    category: {
      type: String,
      enum: ["emergency", "maintenance", "society"],
      required: true,
      index: true, // 🔍 filter by category
    },
    role: {
      type: String,
      trim: true,
      index: true,
    },
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true, // 🔥 IMPORTANT (multi-tenant app)
    },
    wingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wing",
      default: null,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);


// 🔥 COMPOUND INDEX (MOST IMPORTANT)
contactSchema.index({
  societyId: 1,
  wingId: 1,
  category: 1,
  isActive: 1,
});


// 🔍 TEXT SEARCH INDEX (for search feature)
contactSchema.index({
  name: "text",
  role: "text",
});


// 🚫 PREVENT DUPLICATE CONTACTS (OPTIONAL BUT PRO)
contactSchema.index(
  { phone: 1, societyId: 1, wingId: 1 },
  { unique: true }
);

export default mongoose.model("Contact", contactSchema);