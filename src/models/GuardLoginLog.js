import mongoose from "mongoose";

const guardLoginLogSchema = new mongoose.Schema({
  guardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  societyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Society",
    required: true
  },

  loginAt: {
    type: Date,
    default: Date.now
  },

  logoutAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

export default mongoose.model("GuardLoginLog", guardLoginLogSchema);