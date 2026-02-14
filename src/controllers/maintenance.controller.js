import Maintenance from "../models/maintenance.js";
import User from "../models/User.js";


// 🔹 Admin generates bills for all residents
export const generateMonthlyBills = async (req, res) => {
    try {
        const { month, amount, dueDate } = req.body;

        const residents = await User.find({
            societyId: req.user.societyId,
            role: "RESIDENT",
        });
console.log ("Residents found for billing:", residents.length);
        if (!residents.length) {
            return res.status(400).json({ message: "No residents found" });
        }

        const bills = residents.map((resident) => ({
            societyId: req.user.societyId,
            residentId: resident._id,
            flatNumber: resident.flatNumber,
            month,
            amount,
            dueDate,
        }));

        await Maintenance.insertMany(bills);

        res.status(201).json({ message: "Maintenance bills generated successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
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
