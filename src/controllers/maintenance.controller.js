import Maintenance from "../models/Maintenance.js";
import User from "../models/User.js";
import { sendPushNotificationToMany } from "../services/notificationService.js";

/* =========================================================
   🔹 Helper: Extract Year from Month String
========================================================= */
const extractYear = (monthString) => {
    const parts = monthString.split(" ");
    return parseInt(parts[1]);
};

/* =========================================================
   🔹 Admin manually generates monthly bills
========================================================= */
export const generateMonthlyBills = async (req, res) => {
    try {
        const { month, amount, dueDate } = req.body;

        if (!month || !amount || !dueDate) {
            return res.status(400).json({
                message: "Month, amount and dueDate are required",
            });
        }

        const societyId = req.user.societyId;
        const year = extractYear(month);

        const owners = await User.find({
            societyId,
            roles: { $in: ["OWNER"] },
        });

        if (!owners.length) {
            return res.status(400).json({
                message: "No owners found",
            });
        }

        const existingBills = await Maintenance.findOne({
            societyId,
            month,
        });

        if (existingBills) {
            return res.status(400).json({
                message: "Maintenance already generated for this month",
            });
        }

        const bills = [];

        for (const owner of owners) {
            if (!owner.flatNo) continue;

            if (owner.fullYearPaidYears?.includes(year)) continue;

            const paidCount = await Maintenance.countDocuments({
                societyId,
                residentId: owner._id,
                year,
                status: "Paid",
            });

            if (paidCount >= 12) continue;

            bills.push({
                societyId,
                residentId: owner._id,
                wing: owner.wing, // ✅ ADDED
                flatNumber: owner.flatNo,
                month,
                year,
                amount,
                dueDate,
                status: "Pending",
                reminderSent: false,
                paymentType: "MONTHLY",
            });
        }

        if (!bills.length) {
            return res.status(400).json({
                message: "All owners have already paid yearly",
            });
        }

        await Maintenance.insertMany(bills);

        const tokens = owners.flatMap(o => o.fcmTokens || []);

        if (tokens.length) {
            await sendPushNotificationToMany(
                tokens,
                "New Maintenance Bill 🧾",
                `Maintenance for ${month} has been generated`,
                { type: "MAINTENANCE_GENERATED", month }
            );
        }

        return res.status(201).json({
            message: "Maintenance bills generated successfully",
        });

    } catch (error) {
        console.error("Generate Maintenance Error:", error);
        return res.status(500).json({
            message: "Something went wrong while generating bills",
        });
    }
};

/* =========================================================
   🔹 Auto Generate Monthly Maintenance (Cron Ready)
========================================================= */
export const autoGenerateMonthlyMaintenance = async () => {
    try {
        const today = new Date();
        const monthName = today.toLocaleString("default", { month: "long" });
        const year = today.getFullYear();
        const monthString = `${monthName} ${year}`;

        const societies = await User.distinct("societyId");

        for (const societyId of societies) {

            const existing = await Maintenance.findOne({
                societyId,
                month: monthString,
            });

            if (existing) continue;

            const owners = await User.find({
                societyId,
                roles: { $in: ["OWNER"] },
            });

            const bills = [];

            for (const owner of owners) {

                if (owner.fullYearPaidYears?.includes(year)) continue;

                const paidCount = await Maintenance.countDocuments({
                    societyId,
                    residentId: owner._id,
                    year,
                    status: "Paid",
                });

                if (paidCount >= 12) continue;

                bills.push({
                    societyId,
                    residentId: owner._id,
                    wing: owner.wing, // ✅ ADDED
                    flatNumber: owner.flatNo,
                    month: monthString,
                    year,
                    amount: 1000,
                    dueDate: new Date(year, today.getMonth(), 10),
                    status: "Pending",
                    reminderSent: false,
                    paymentType: "MONTHLY",
                });
            }

            if (bills.length) {
                await Maintenance.insertMany(bills);

                const tokens = owners.flatMap(o => o.fcmTokens || []);

                if (tokens.length) {
                    await sendPushNotificationToMany(
                        tokens,
                        "New Maintenance Bill 🧾",
                        `Maintenance for ${monthString} has been auto-generated`,
                        { type: "MAINTENANCE_AUTO_GENERATED", month: monthString }
                    );
                }
            }
        }

        console.log("Auto maintenance generation completed");

    } catch (error) {
        console.error("Auto Maintenance Error:", error);
    }
};

/* =========================================================
   🔹 5-Day Reminder Cron
========================================================= */
export const sendMaintenanceDueReminders = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const targetDate = new Date(today);
        targetDate.setDate(targetDate.getDate() + 5);
        targetDate.setHours(23, 59, 59, 999);

        const bills = await Maintenance.find({
            status: "Pending",
            dueDate: { $gte: today, $lte: targetDate },
            reminderSent: false,
        }).populate("residentId");

        for (const bill of bills) {
            const tokens = bill.residentId?.fcmTokens || [];

            if (tokens.length) {
                await sendPushNotificationToMany(
                    tokens,
                    "Maintenance Due Reminder ⏰",
                    `Your maintenance for ${bill.month} is due on ${bill.dueDate.toDateString()}`,
                    { type: "MAINTENANCE_REMINDER", billId: bill._id.toString() }
                );
            }

            bill.reminderSent = true;
            await bill.save();
        }

        console.log(`Sent ${bills.length} reminders`);

    } catch (error) {
        console.error("Maintenance Reminder Error:", error);
    }
};

/* =========================================================
   🔹 Admin Marks Bill as Paid
========================================================= */
export const markBillAsPaid = async (req, res) => {
    try {
        const bill = await Maintenance.findById(req.params.id)
            .populate("residentId");

        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        bill.status = "Paid";
        bill.paidAt = new Date();
        bill.paidBy = req.user.userId;
        bill.reminderSent = true;

        bill.paymentType = "MONTHLY";
        bill.coveredMonths = [bill.month];

        await bill.save();

        const tokens = bill.residentId?.fcmTokens || [];

        if (tokens.length) {
            await sendPushNotificationToMany(
                tokens,
                "Payment Confirmed ✅",
                `Your maintenance payment for ${bill.month} has been confirmed`,
                { type: "MAINTENANCE_PAID", billId: bill._id.toString() }
            );
        }

        res.json({
            message: "Bill marked as paid successfully",
        });

    } catch (error) {
        console.error("Mark Bill Paid Error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* =========================================================
   🔹 Resident Gets Own Bills
========================================================= */
export const getResidentBills = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const query = { residentId: req.user.userId };

        const total = await Maintenance.countDocuments(query);

        const bills = await Maintenance.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            data: bills,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            hasMore: page * limit < total,
        });

    } catch (error) {
        console.error("Get Bills Error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* =========================================================
   🔹 Admin Views All Society Bills
========================================================= */
export const getAllSocietyBills = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const query = { societyId: req.user.societyId };

        if (req.query.status) {
            query.status = req.query.status;
        }

        if (req.query.type === "YEARLY") {
            query.paymentType = "YEARLY";
        }

        if (req.query.wing) { // ✅ ADDED
            query.wing = req.query.wing;
        }

        const total = await Maintenance.countDocuments(query);

        const bills = await Maintenance.find(query)
            .populate("residentId", "name flatNo wing roles") // ✅ ADDED wing
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            data: bills,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            hasMore: page * limit < total,
        });

    } catch (error) {
        console.error("Error fetching society bills:", error);
        res.status(500).json({ message: error.message });
    }
};

/* =========================================================
   🔹 Admin Marks Full Year as Paid (Per Resident)
========================================================= */
export const payFullYearMaintenance = async (req, res) => {
    try {
        const { residentId, year, paymentMode, paymentNote } = req.body;
        const societyId = req.user.societyId;
        const parsedYear = parseInt(year);

        if (!residentId || !parsedYear) {
            return res.status(400).json({
                message: "residentId and year are required",
            });
        }

        const bills = await Maintenance.find({
            societyId,
            residentId,
            year: parsedYear,
            status: { $in: ["Pending", "Overdue"] },
        }).populate("residentId");

        if (!bills.length) {
            return res.status(400).json({
                message: "No pending bills found for this year",
            });
        }

        const now = new Date();

        const allMonths = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ]; // 🔥 ADDED

        for (const bill of bills) {
            bill.status = "Paid";
            bill.paidAt = now;
            bill.paidBy = req.user.userId;
            bill.paymentMode = paymentMode || "CASH";
            bill.paymentNote =
                paymentNote || "Full year payment marked by admin";
            bill.reminderSent = true;

            bill.paymentType = "YEARLY"; // 🔥 ADDED
            bill.coveredMonths = allMonths; // 🔥 ADDED

            await bill.save();
        }

        await User.findByIdAndUpdate(residentId, {
            $addToSet: { fullYearPaidYears: parsedYear }
        });

        const tokens = bills[0].residentId?.fcmTokens || [];

        if (tokens.length) {
            await sendPushNotificationToMany(
                tokens,
                "Full Year Payment Confirmed ✅",
                `Your full year maintenance for ${parsedYear} has been marked as paid`,
                {
                    type: "MAINTENANCE_FULL_YEAR_PAID",
                    year: parsedYear,
                }
            );
        }

        return res.json({
            success: true,
            message: "Full year maintenance marked as paid successfully",
        });

    } catch (error) {
        console.error("Full Year Payment Error:", error);
        return res.status(500).json({
            message: "Something went wrong while marking full year payment",
        });
    }
};

export const getMaintenanceDashboardStats = async (req, res) => {
    try {

        const societyId = req.user.societyId;

        const today = new Date();
        const currentMonth = today.toLocaleString("default", { month: "long" });
        const year = today.getFullYear();
        const monthString = `${currentMonth} ${year}`;

        // Total flats
        const totalFlats = await User.countDocuments({
            societyId,
            roles: { $in: ["OWNER"] }
        });

        // Paid this month
        const paidThisMonth = await Maintenance.countDocuments({
            societyId,
            month: monthString,
            status: "Paid"
        });

        // Pending this month
        const pendingPayments = await Maintenance.countDocuments({
            societyId,
            month: monthString,
            status: "Pending"
        });

        // Overdue
        const overduePayments = await Maintenance.countDocuments({
            societyId,
            status: "Overdue"
        });

        // Full year payers
        const fullYearPaid = await User.countDocuments({
            societyId,
            fullYearPaidYears: year
        });

        // Total collection
        const collection = await Maintenance.aggregate([
            {
                $match: {
                    societyId,
                    year,
                    status: "Paid"
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const totalCollection = collection[0]?.total || 0;

        res.json({
            totalFlats,
            paidThisMonth,
            pendingPayments,
            overduePayments,
            fullYearPaid,
            totalCollection
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({
            message: "Error fetching dashboard stats"
        });
    }
};