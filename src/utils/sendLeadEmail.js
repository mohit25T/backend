import axios from "axios";
import "dotenv/config";

export const sendLeadEmail = async (leadData) => {
  const { name, companyName, email, phone, businessType, message } = leadData;

  if (!process.env.BREVO_API_KEY) {
    console.warn("⚠️ BREVO_API_KEY not found in environment variables. Skipping email dispatch.");
    return;
  }

  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Apex IT World ERP Leads",
          email: process.env.EMAIL_USER || "info@apexitworld.com"
        },
        to: [
          {
            email: process.env.EMAIL_USER || "info@apexitworld.com"
          }
        ],
        replyTo: {
          email: email,
          name: name
        },
        subject: `New Connect With Us Inquiry - ${companyName}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 600px; margin: 0 auto; color: #2d3748;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">New Business Inquiry</h2>
            <p>A new query has been received from the <b>Connect With Us</b> form on the website.</p>
            
            <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; width: 35%; color: #4a5568;">Contact Name:</td>
                  <td style="padding: 6px 0; color: #1a202c;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #4a5568;">Company Name:</td>
                  <td style="padding: 6px 0; color: #1a202c;">${companyName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #4a5568;">Email:</td>
                  <td style="padding: 6px 0; color: #1a202c;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #4a5568;">Phone Number:</td>
                  <td style="padding: 6px 0; color: #1a202c;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #4a5568;">Business Sector:</td>
                  <td style="padding: 6px 0; color: #1a202c;">${businessType}</td>
                </tr>
              </table>
            </div>

            <div style="border-left: 4px solid #2563eb; padding-left: 15px; margin: 20px 0;">
              <h4 style="margin: 0 0 8px 0; color: #4a5568; font-size: 14px;">Message / Inquiries:</h4>
              <p style="margin: 0; line-height: 1.6; color: #2d3748; white-space: pre-wrap;">${message}</p>
            </div>

            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
            <p style="font-size: 11px; color: #718096; text-align: center; margin: 0;">
              This notification was generated automatically by the Apex IT World ERP Leads handler.
            </p>
          </div>
        `
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    console.log(`Lead notification email sent to ${process.env.EMAIL_USER || "info@apexitworld.com"}`);
  } catch (error) {
    console.error(
      "Brevo lead email error:",
      error?.response?.data || error.message
    );
    throw new Error("Failed to send lead notification email");
  }
};
