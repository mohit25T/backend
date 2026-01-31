import User from "../models/User.js";
import Society from "../models/Society.js";
import { auditLogger } from "../utils/auditLogger.js"; // ✅ ADDED

/* -------- ADMIN -------- */
export const toggleAdminStatus = async (req, res) => {
  const { adminId } = req.params;

  const admin = await User.findOne({
    _id: adminId,
    roles: "ADMIN"
  });

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  const oldStatus = admin.status;

  admin.status =
    admin.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
  console.log(admin);
  await admin.save();


  // ✅ AUDIT LOG
  await auditLogger({
    req,
    action:
      admin.status === "BLOCKED"
        ? "BLOCK_ADMIN"
        : "UNBLOCK_ADMIN",
    targetType: "USER",
    targetId: admin._id,
    societyId: admin.societyId,
    description: `Admin ${admin.name} status changed from ${oldStatus} to ${admin.status}`
  });

  res.json({
    message: `Admin ${admin.status.toLowerCase()} successfully`,
    status: admin.status
  });
};

/* -------- SOCIETY -------- */
export const toggleSocietyStatus = async (req, res) => {
  const { societyId } = req.params;

  const society = await Society.findById(societyId);

  if (!society) {
    return res.status(404).json({ message: "Society not found" });
  }

  const oldStatus = society.status;

  society.status =
    society.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

  await society.save();

  // ✅ AUDIT LOG
  await auditLogger({
    req,
    action:
      society.status === "BLOCKED"
        ? "BLOCK_SOCIETY"
        : "UNBLOCK_SOCIETY",
    targetType: "SOCIETY",
    targetId: society._id,
    societyId: society._id,
    description: `Society "${society.name}" status changed from ${oldStatus} to ${society.status}`
  });

  res.json({
    message: `Society ${society.status.toLowerCase()} successfully`,
    status: society.status
  });
};
