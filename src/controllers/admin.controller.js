import User from "../models/User.js";
import VisitorLog from "../models/VisitorLog.js";
import { auditLogger } from "../utils/auditLogger.js";
import Invite from "../models/Invite.js";
import Flat from "../models/Flats.js";
import Subscription from "../models/Subscription.js";


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

  const oldName = admin.name;
  const oldMobile = admin.mobile;

  if (name) {
    admin.name = name;
  }

  if (mobile && mobile !== admin.mobile) {
    admin.mobile = mobile;
    admin.status = "PENDING_VERIFICATION";
    admin.otp = null;
    admin.otpExpiresAt = null;
  }

  await admin.save();

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


/**
 * GET PENDING TENANT REQUESTS
 * Admin can filter by wing
 */
export const getPendingTenantRequests = async (req, res) => {
  try {

    const admin = await User.findById(req.user.userId);

    if (!admin.roles.includes("ADMIN")) {
      return res.status(403).json({
        message: "Only admin can view pending tenants"
      });
    }

    const { wing } = req.query;

    const query = {
      societyId: admin.societyId,
      roles: "TENANT",
      status: "PENDING"
    };

    if (wing) {
      query.wing = wing;
    }

    const pendingTenants = await Invite.find(query)
      .sort({ createdAt: -1 });

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


/**
 * APPROVE TENANT
 */
export const approveTenant = async (req, res) => {
  try {

    const { inviteId } = req.params;

    const invite = await Invite.findById(inviteId);

    if (!invite || !invite.roles.includes("TENANT")) {
      return res.status(400).json({
        message: "Invalid tenant invite"
      });
    }

    if (invite.status !== "PENDING") {
      return res.status(400).json({
        message: "Invite already processed"
      });
    }

    // 🔥 Get Flat (NEW)
    const flat = await Flat.findById(invite.flatId);

    if (!flat) {
      return res.status(400).json({
        message: "Flat not found"
      });
    }

    // 🔥 Get Active Subscription (NEW)
    const subscription = await Subscription.findOne({
      societyId: invite.societyId,
      status: "active"
    });

    if (!subscription) {
      return res.status(400).json({
        message: "No active subscription found"
      });
    }

    // 🔒 Check if flat is subscribed (MAIN FIX)
    if (!flat.isSubscribed) {
      return res.status(403).json({
        message: "This flat is not included in your subscription. Please upgrade your plan."
      });
    }

    // 🔥 Create Tenant User (UPDATED)
    const user = await User.create({
      name: invite.name,
      mobile: invite.mobile,
      email: invite.email,
      roles: ["TENANT"],
      flatId: flat._id, // ✅ IMPORTANT FIX
      wing: flat.wing,
      flatNo: flat.flatNo,
      societyId: invite.societyId,
      invitedBy: invite.invitedBy,
      status: "ACTIVE",
      fcmTokens: [],
      isProfileComplete: false
    });

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