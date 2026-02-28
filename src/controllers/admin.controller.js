import User from "../models/User.js";
import VisitorLog from "../models/VisitorLog.js";
import { auditLogger } from "../utils/auditLogger.js"; // ✅ ADDED
import Invite from "../models/Invite.js";

/**
 * UPDATE ADMIN DETAILS
 * Only Super Admin
 */
export const updateAdminDetails = async (req, res) => {
  const { adminId } = req.params;
  const { name, mobile } = req.body;

  const admin = await User.findOne({
    _id: adminId,
    roles: "ADMIN"
  });

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  // 🔹 Capture old values for audit description
  const oldName = admin.name;
  const oldMobile = admin.mobile;

  // Name update (safe)
  if (name) {
    admin.name = name;
  }

  // Mobile update (security-sensitive)
  if (mobile && mobile !== admin.mobile) {
    admin.mobile = mobile;
    admin.status = "PENDING_VERIFICATION";
    admin.otp = null; // force re-verification
    admin.otpExpiresAt = null;
  }

  await admin.save();

  // ✅ AUDIT LOG (SAFE, EXPLICIT)
  await auditLogger({
    req,
    action: "UPDATE_ADMIN",
    targetType: "USER",
    targetId: admin._id,
    societyId: admin.societyId,
    description: `Admin updated: name "${oldName}" → "${admin.name}", mobile "${oldMobile}" → "${admin.mobile}"`
  });

  res.json({
    message: "Admin details updated",
    requiresVerification: !!mobile
  });
};

export const getAllSocietyVisitors = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("societyId");

    if (!user || !user.societyId) {
      return res.status(403).json({
        success: false,
        message: "User is not linked to any society"
      });
    }

    const societyId = user.societyId;

    // 🔹 Pagination Params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // 🔹 Total Count
    const totalVisitors = await VisitorLog.countDocuments({ societyId });

    // 🔹 Fetch Paginated Data
    const visitors = await VisitorLog.find({ societyId })
      .populate("approvedBy", "name")
      .populate("guardId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      societyId,
      totalVisitors,
      currentPage: page,
      totalPages: Math.ceil(totalVisitors / limit),
      hasMore: page * limit < totalVisitors,
      visitors
    });

  } catch (error) {
    console.error("Get Society Visitors Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch society visitors"
    });
  }
};

export const getPendingTenantRequests = async (req, res) => {
  try {
    const admin = await User.findById(req.user.userId);

    if (!admin.roles.includes("ADMIN")) {
      return res.status(403).json({
        message: "Only admin can view pending tenants"
      });
    }

    const pendingTenants = await Invite.find({
      societyId: admin.societyId,
      role: "TENANT",
      status: "PENDING"
    }).sort({ createdAt: -1 });
    console.log("PENDING TENANTS:", pendingTenants);
    return res.json({
      success: true,
      data: pendingTenants
    });

  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch pending tenants"
    });
  }
};

export const approveTenant = async (req, res) => {
  try {
    const { inviteId } = req.params;

    const invite = await Invite.findById(inviteId);

    if (!invite || invite.role !== "TENANT") {
      return res.status(400).json({
        message: "Invalid tenant invite"
      });
    }

    if (invite.status !== "PENDING") {
      return res.status(400).json({
        message: "Invite already processed"
      });
    }

    // 🔥 Create Tenant User
    const user = await User.create({
      name: invite.name,
      mobile: invite.mobile,
      email: invite.email,
      roles: ["TENANT"],
      flatNo: invite.flatNo,
      societyId: invite.societyId,
      invitedBy: invite.invitedBy,
      status: "ACTIVE",
      fcmTokens: [],
      isProfileComplete: false
    });

    // 🔥 Mark invite used
    invite.status = "USED";
    await invite.save();

    return res.json({
      message: "Tenant approved successfully",
      user
    });

  } catch (error) {
    console.error("APPROVE TENANT ERROR:", error);
    return res.status(500).json({
      message: "Failed to approve tenant"
    });
  }
};