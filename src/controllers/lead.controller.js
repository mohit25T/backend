import Lead from "../models/Lead.js";
import { sendLeadEmail } from "../utils/sendLeadEmail.js";

export const createLead = async (req, res, next) => {
  try {
    const { name, companyName, email, phone, businessType, message } = req.body;

    // Validation
    if (!name || !companyName || !email || !phone || !businessType || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Save lead to database
    const newLead = await Lead.create({
      name,
      companyName,
      email,
      phone,
      businessType,
      message
    });

    // Send email notification (asynchronously, so we don't block the HTTP response)
    sendLeadEmail({
      name,
      companyName,
      email,
      phone,
      businessType,
      message
    }).catch((emailError) => {
      console.error("Failed to send lead email:", emailError.message);
    });

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      lead: newLead
    });
  } catch (error) {
    next(error);
  }
};
