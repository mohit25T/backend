import User from "../models/User.js";
import { auditLogger } from "../utils/auditLogger.js";

/**
 * REPLACE ADMIN
 * Only Super Admin
 *
 * Logic:
 * - Admin must belong to same society
 * - New admin must be OWNER or TENANT
 * - Flat number must exist
 * - Wing must exist
 */
export const replaceAdmin = async (req, res) => {
  try {
    const { oldAdminId } = req.params;
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        message: "User mobile number is required"
      });
    }

    // 1️⃣ Find old admin
    const oldAdmin = await User.findOne({
      _id: oldAdminId,
      roles: "ADMIN"
    });

    if (!oldAdmin) {
      return res.status(404).json({
        message: "Old admin not found"
      });
    }

    // 2️⃣ Find eligible replacement (OWNER or TENANT)
    const newAdmin = await User.findOne({
      mobile,
      societyId: oldAdmin.societyId,
      roles: { $in: ["OWNER", "TENANT"] },
      status: "ACTIVE"
    });

    if (!newAdmin) {
      return res.status(400).json({
        message: "Eligible user (OWNER/TENANT) not found in this society"
      });
    }

    if (!newAdmin.flatNo) {
      return res.status(400).json({
        message: "Flat number not found for selected user"
      });
    }

    if (!newAdmin.wing) {
      return res.status(400).json({
        message: "Wing not assigned to selected user"
      });
    }

    /* ====================================================
       🔁 ROLE SWITCH LOGIC
    ==================================================== */

    // Remove ADMIN role from old admin
    oldAdmin.roles = oldAdmin.roles.filter(
      role => role !== "ADMIN"
    );

    await oldAdmin.save();

    // Promote new user → add ADMIN role
    if (!newAdmin.roles.includes("ADMIN")) {
      newAdmin.roles.push("ADMIN");
      await newAdmin.save();
    }

    /* ====================================================
       ✅ AUDIT LOG
    ==================================================== */

    await auditLogger({
      req,
      action: "REPLACE_ADMIN",
      targetType: "USER",
      targetId: newAdmin._id,
      societyId: oldAdmin.societyId,
      description: `Admin replaced: ${oldAdmin.name} → ${newAdmin.name} | Wing ${newAdmin.wing} | Flat ${newAdmin.flatNo}`
    });

    res.json({
      message: "Admin replaced successfully",

      oldAdmin: {
        id: oldAdmin._id,
        roles: oldAdmin.roles
      },

      newAdmin: {
        id: newAdmin._id,
        roles: newAdmin.roles,
        wing: newAdmin.wing,
        flatNo: newAdmin.flatNo
      }
    });

  } catch (err) {
    console.error("REPLACE ADMIN ERROR:", err);

    res.status(500).json({
      message: "Failed to replace admin"
    });
  }
};