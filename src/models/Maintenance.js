import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },

    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* =====================================================
       🏢 FLAT LINK (🔥 IMPORTANT CHANGE)
    ===================================================== */

    flatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      required: true,
      index: true,
    },

    // Optional (for UI display)
    wing: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    flatNumber: {
      type: String,
      required: true,
    },

    month: {
      type: String,
      required: true,
      index: true,
    },

    year: {
      type: Number,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Overdue"],
      default: "Pending",
      index: true,
    },

    /* ===============================
       💰 PAYMENT INFO
    =============================== */

    paidAt: {
      type: Date,
    },

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reminderSent: {
      type: Boolean,
      default: false,
    },

    paymentMode: {
      type: String,
      enum: ["CASH", "UPI", "CHEQUE", "ONLINE"],
    },

    paymentNote: {
      type: String,
    },

    transactionId: {
      type: String,
    },

    /* =====================================================
       🔥 MULTI-MONTH SUPPORT
    ===================================================== */

    paymentType: {
      type: String,
      enum: ["MONTHLY", "YEARLY"],
      default: "MONTHLY",
    },

    coveredMonths: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);


/* =====================================================
   🔥 INDEXES
===================================================== */

// Resident bill listing
maintenanceSchema.index({ residentId: 1, createdAt: -1 });

// Society-wide listing
maintenanceSchema.index({ societyId: 1, createdAt: -1 });

// Status filtering
maintenanceSchema.index({ societyId: 1, status: 1 });

// 🔥 Flat-based lookup (NEW)
maintenanceSchema.index({ societyId: 1, flatId: 1 });

// Monthly reports
maintenanceSchema.index({ societyId: 1, month: 1 });

// Yearly lookup
maintenanceSchema.index({ societyId: 1, residentId: 1, year: 1 });

// Overdue cron
maintenanceSchema.index({ dueDate: 1, status: 1 });

export default mongoose.model("Maintenance", maintenanceSchema);