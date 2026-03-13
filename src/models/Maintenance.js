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

    /* =====================================================
       🏢 WING + FLAT INFO
    ===================================================== */

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

    /* =====================================================
       🔥 NEW FIELDS ADDED (DO NOT REMOVE EXISTING STRUCTURE)
       Support for full year / multi month maintenance
    ===================================================== */

    paymentType: {
      type: String,
      enum: ["MONTHLY", "YEARLY"],
      default: "MONTHLY",
    },

    // For yearly payments this will contain all months covered
    coveredMonths: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

/* =====================================================
   🔥 PRODUCTION OPTIMIZED INDEXES
===================================================== */

// Resident bill listing
maintenanceSchema.index({ residentId: 1, createdAt: -1 });

// Society-wide listing (Admin)
maintenanceSchema.index({ societyId: 1, createdAt: -1 });

// Filtering by status
maintenanceSchema.index({ societyId: 1, status: 1 });

// 🔥 Wing + flat queries
maintenanceSchema.index({ societyId: 1, wing: 1, flatNumber: 1 });

// Monthly reports
maintenanceSchema.index({ societyId: 1, month: 1 });

// Yearly payment lookup
maintenanceSchema.index({ societyId: 1, residentId: 1, year: 1 });

// Overdue cron jobs
maintenanceSchema.index({ dueDate: 1, status: 1 });

export default mongoose.model("Maintenance", maintenanceSchema);