import User from "../models/User.js";
import Invite from "../models/Invite.js";
import VisitorLog from "../models/VisitorLog.js";
import cloudinary from "../config/cloudinary.js";
import GuardLoginLog from "../models/GuardLoginLog.js";

const normalizeFlatNo = (flatNo) =>
  flatNo?.trim().toUpperCase();

/**
 * ==========================================
 * GET USERS BY ROLE (ADMIN / OWNER / TENANT / GUARD)
 * ==========================================
 */
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const users = await User.find({ roles: { $in: [role] } })
      .populate("societyId", "name city _id")
      .select("name email mobile roles status societyId wing createdAt")
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (error) {
    console.error("GET USERS BY ROLE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * ==========================
 * GET MY PROFILE
 * ==========================
 */
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId)
      .populate("societyId", "name")
      .populate("invitedBy", "name mobile")
      .select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const requiresProfilePhoto = !user.profileImage;

    return res.status(200).json({
      success: true,
      requiresProfilePhoto,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        roles: user.roles,
        wing: user.wing,
        flatNo: user.flatNo,
        status: user.status,
        society: user.societyId,
        invitedBy: user.invitedBy,
        createdAt: user.createdAt,
        profileImage: user.profileImage || null
      }
    });

  } catch (error) {
    console.error("Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile"
    });
  }
};


/**
 * =================================
 * GET OWNER / TENANT VISITOR HISTORY
 * =================================
 */
export const getResidentVisitorHistory = async (req, res) => {
  try {
    const { userId, societyId, roles } = req.user;

    if (
      !roles ||
      (!roles.includes("OWNER") && !roles.includes("TENANT"))
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Flat members only."
      });
    }

    const user = await User.findById(userId);

    if (!user || !user.flatNo) {
      return res.status(400).json({
        success: false,
        message: "User flat not found"
      });
    }

    const flatNo = normalizeFlatNo(user.flatNo);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {
      societyId,
      flatNo,
      wing: user.wing
    };

    const activeTenant = await User.findOne({
      societyId,
      flatNo,
      wing: user.wing,
      roles: { $in: ["TENANT"] },
      status: "ACTIVE"
    });

    if (activeTenant) {
      if (roles.includes("TENANT")) {
        filter.createdAt = { $gte: activeTenant.createdAt };
      } else if (roles.includes("OWNER")) {
        filter.createdAt = { $lt: activeTenant.createdAt };
      }
    }

    const totalVisitors = await VisitorLog.countDocuments(filter);

    const visitors = await VisitorLog.find(filter)
      .populate("guardId", "name")
      .populate("approvedBy", "name roles")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      totalVisitors,
      currentPage: page,
      totalPages: Math.ceil(totalVisitors / limit),
      hasMore: page * limit < totalVisitors,
      visitors
    });

  } catch (error) {
    console.error("Visitor History Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch visitor history"
    });
  }
};


/**
 * =================================
 * GET USERS BY SOCIETY
 * =================================
 */
export const getUsersBySociety = async (req, res) => {
  try {
    const societyId = req.user.societyId;
    const { role, wing, flatNo } = req.query;

    const filter = { societyId };

    if (role) filter.roles = { $in: [role] };
    if (wing) filter.wing = wing.toUpperCase();
    if (flatNo) filter.flatNo = flatNo.trim();

    const users = await User.find(filter)
      .populate("societyId", "name city _id")
      .select(
        "name email mobile roles status societyId wing flatNo createdAt profileImage"
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      users
    });

  } catch (error) {
    console.error("GET USERS BY SOCIETY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};


/**
 * =================================
 * UPLOAD PROFILE PHOTO
 * =================================
 */
export const uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Image file is required"
      });
    }

    const profileImageUrl = req.files[0].path;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        profileImage: profileImageUrl,
        isProfileComplete: true
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile photo uploaded successfully",
      profileImage: user.profileImage
    });

  } catch (error) {
    console.error("UPLOAD PROFILE PHOTO ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload profile photo"
    });
  }
};


/**
 * =================================
 * GET TENANT DETAILS (OWNER)
 * =================================
 */
export const getResidentTenantDetails = async (req, res) => {
  try {
    const owner = await User.findById(req.user.userId);

    if (!owner.roles.includes("OWNER")) {
      return res.status(403).json({
        message: "Only owner can view tenant details"
      });
    }

    const activeTenant = await User.findOne({
      societyId: owner.societyId,
      flatNo: owner.flatNo,
      wing: owner.wing,
      roles: { $in: ["TENANT"] },
      status: "ACTIVE"
    });

    if (activeTenant) {
      return res.json({
        success: true,
        type: "ACTIVE",
        data: activeTenant
      });
    }

    const pendingTenant = await Invite.findOne({
      societyId: owner.societyId,
      flatNo: owner.flatNo,
      wing: owner.wing,
      roles: { $in: ["TENANT"] },
      status: "PENDING"
    });

    if (pendingTenant) {
      return res.json({
        success: true,
        type: "PENDING",
        data: pendingTenant
      });
    }

    return res.status(404).json({
      message: "No tenant found for your flat"
    });

  } catch (err) {
    console.error("RESIDENT TENANT ERROR:", err);
    return res.status(500).json({
      message: "Failed to fetch tenant details"
    });
  }
};


/**
 * =================================
 * REMOVE TENANT
 * =================================
 */
export const removeTenant = async (req, res) => {
  try {
    const owner = await User.findById(req.user.userId);

    if (!owner.roles.includes("OWNER")) {
      return res.status(403).json({
        message: "Only owner can remove tenant"
      });
    }

    const tenant = await User.findOne({
      societyId: owner.societyId,
      flatNo: owner.flatNo,
      wing: owner.wing,
      roles: { $in: ["TENANT"] },
      status: "ACTIVE"
    });

    if (!tenant) {
      return res.status(404).json({
        message: "No active tenant found"
      });
    }

    tenant.status = "INACTIVE";
    tenant.leftAt = new Date();

    await tenant.save();

    return res.json({
      success: true,
      message: "Tenant removed successfully"
    });

  } catch (err) {
    console.error("REMOVE TENANT ERROR:", err);
    return res.status(500).json({
      message: "Failed to remove tenant"
    });
  }
};


/**
 * =================================
 * GUARD ACTIVITY
 * =================================
 */
export const getGuardActivity = async (req, res) => {
  try {

    const societyId = req.user.societyId;

    const guards = await User.find({
      societyId,
      roles: "GUARD"
    }).select("name wing shiftStartTime shiftEndTime shiftType");

    const guardIds = guards.map(g => g._id);

    const logs = await GuardLoginLog.find({
      guardId: { $in: guardIds }
    })
      .sort({ loginAt: -1 })
      .populate("guardId", "name");

    const result = guards.map((guard) => {

      const log = logs.find(
        (l) => l.guardId._id.toString() === guard._id.toString()
      );

      let status = "OFFLINE";

      if (log && !log.logoutAt) {
        status = "ACTIVE";
      }

      return {
        guardId: guard._id,
        name: guard.name,
        wing: guard.wing,
        shiftStartTime: guard.shiftStartTime,
        shiftEndTime: guard.shiftEndTime,
        shiftType: guard.shiftType,
        loginAt: log?.loginAt || null,
        logoutAt: log?.logoutAt || null,
        status
      };

    });

    res.json(result);

  } catch (error) {

    console.error("GET GUARD ACTIVITY ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch guard activity"
    });

  }
};