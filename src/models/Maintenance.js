import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },

    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    flatNumber: {
      type: String,
      required: true,
    },

    month: {
      type: String, // Example: "March 2026"
      required: true,
    },

    // 🔥 (Future safe improvement)
    year: {
      type: Number,
    },

    amount: {
      type: Number,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Overdue"],
      default: "Pending",
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

    // 🔥 Future online payment support
    transactionId: {
      type: String,
    },

  },
  { timestamps: true }
);

/* =====================================================
   🔥 PRODUCTION OPTIMIZED INDEXES
===================================================== */

// 🔥 For resident bill listing (MOST IMPORTANT)
maintenanceSchema.index({ residentId: 1, createdAt: -1 });

// 🔥 For society-wide listing (Admin view)
maintenanceSchema.index({ societyId: 1, createdAt: -1 });

// 🔥 For filtering by status inside society
maintenanceSchema.index({ societyId: 1, status: 1 });

// 🔥 For flat-specific queries
maintenanceSchema.index({ societyId: 1, flatNumber: 1 });

// 🔥 For monthly reports
maintenanceSchema.index({ societyId: 1, month: 1 });

// 🔥 For yearly bulk updates (important for full-year payment)
maintenanceSchema.index({ societyId: 1, residentId: 1, year: 1 });

// 🔥 For overdue detection cron jobs
maintenanceSchema.index({ dueDate: 1, status: 1 });

export default mongoose.model("Maintenance", maintenanceSchema);