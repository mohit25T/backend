import Maintenance from "../models/maintenance.js";
import User from "../models/User.js";


// 🔹 Admin generates bills for all residents
export const generateMonthlyBills = async (req, res) => {
    try {
        const { month, amount, dueDate } = req.body;

        if (!month || !amount || !dueDate) {
            return res.status(400).json({
                message: "Month, amount and dueDate are required",
            });
        }

        // 🔹 Fetch only residents of this society
        const residents = await User.find({
            societyId: req.user.societyId,
            roles: "RESIDENT",
        });

        if (!residents.length) {
            return res.status(400).json({
                message: "No residents found",
            });
        }

        // 🔹 Prevent duplicate month generation
        const existingBills = await Maintenance.findOne({
            societyId: req.user.societyId,
            month: month,
        });

        if (existingBills) {
            return res.status(400).json({
                message: "Maintenance already generated for this month",
            });
        }

        // 🔹 Prepare bills (skip residents without flatNo)
        const bills = residents
            .filter((r) => r.flatNo)
            .map((resident) => ({
                societyId: req.user.societyId,
                residentId: resident._id,
                flatNumber: resident.flatNo,
                month,
                amount,
                dueDate,
                status: "Pending",
            }));

        if (!bills.length) {
            return res.status(400).json({
                message: "Residents missing flat numbers",
            });
        }

        await Maintenance.insertMany(bills);

        return res.status(201).json({
            message: "Maintenance bills generated successfully",
        });

    } catch (error) {
        console.error("Error generating bills:", error);
        return res.status(500).json({
            message: "Something went wrong while generating bills",
        });
    }
};


// 🔹 Resident gets own bills
export const getResidentBills = async (req, res) => {
    try {
        const bills = await Maintenance.find({
            residentId: req.user._id,
        }).sort({ createdAt: -1 });

        res.json(bills);

    } catch (error) {
        console.error("Error fetching resident bills:", error);
        res.status(500).json({ message: error.message });
    }
};


// 🔹 Resident marks bill as paid
export const markBillAsPaid = async (req, res) => {
    try {
        const bill = await Maintenance.findById(req.params.id);

        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        if (bill.residentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        bill.status = "Paid";
        bill.paidAt = new Date();

        await bill.save();

        res.json({ message: "Bill marked as paid successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 🔹 Admin views all payments in society
export const getAllSocietyBills = async (req, res) => {
    try {
        const bills = await Maintenance.find({
            societyId: req.user.societyId,
        }).populate("residentId", "name email flatNumber");

        res.json(bills);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
