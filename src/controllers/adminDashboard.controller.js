/*import User from "../models/User.js";
import Society from "../models/Society.js";
import VisitorLog from "../models/VisitorLog.js";

export const getAdminDashboard = async (req, res) => {
  const { userId, societyId, role } = req.user;

  if (role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied" });
  }

  const society = await Society.findById(societyId);

  if (!society) {
    return res.status(404).json({ message: "Society not found" });
  }

  const [residents, guards, visitors] = await Promise.all([
    User.countDocuments({ societyId, roles: "RESIDENT" }),
    User.countDocuments({ societyId, roles: "GUARD" }),
    VisitorLog.countDocuments({ societyId })
  ]);

  res.json({
    societyName: society.name,
    residents,
    guards,
    visitors
  });
};
*/
