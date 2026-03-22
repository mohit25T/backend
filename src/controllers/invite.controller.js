import Invite from "../models/Invite.js";
import Society from "../models/Society.js";
import User from "../models/User.js";
import Flat from "../models/Flats.js";
import Subscription from "../models/Subscription.js"; // 🔥 ADDED
import { auditLogger } from "../utils/auditLogger.js";

const INVITE_EXPIRY_HOURS = 24;

/* 🔥 HELPER: Validate Flat + Subscription */
const validateFlatAccess = async (societyId, wing, flatNo) => {
  const flat = await Flat.findOne({ societyId, wing, flatNo });

  if (!flat) {
    return { error: "Flat not found" };
  }

  if (!flat.isSubscribed) {
    return { error: "Flat not included in subscription. Please upgrade plan." };
  }

  return { flat };
};

/* 🔥 ADDED: CHECK FLAT LIMIT */
const checkFlatLimit = async (societyId) => {
  const subscription = await Subscription.findOne({
    societyId,
    status: "active"
  });

  // Setup mode (no subscription yet)
  if (!subscription) {
    return { allowed: true };
  }

  const totalFlats = await Flat.countDocuments({ societyId });

  if (totalFlats >= subscription.allowedFlats) {
    return {
      allowed: false,
      message: "Flat limit reached. Please upgrade your subscription."
    };
  }

  return { allowed: true, subscription };
};

/**
 * CREATE ADMIN INVITE
 */
export const inviteAdmin = async (req, res) => {
  try {
    const { name, mobile, email, societyId, flatNo, wing } = req.body;

    /* =====================================================
       🧾 VALIDATION
    ===================================================== */

    if (!name || !mobile || !email || !societyId || !flatNo || !wing) {
      return res.status(400).json({
        message:
          "Name, mobile, email, societyId, wing and flat number are required"
      });
    }

    const normalizedWing = wing.trim().toUpperCase();
    const normalizedFlatNo = flatNo.trim();

    const society = await Society.findById(societyId);

    if (!society) {
      return res.status(404).json({
        message: "Society not found"
      });
    }

    /* =====================================================
       🔥 ADDED: CHECK SUBSCRIPTION LIMIT
    ===================================================== */

    const limitCheck = await checkFlatLimit(societyId);
    if (!limitCheck.allowed) {
      return res.status(403).json({
        message: limitCheck.message
      });
    }

    /* =====================================================
       🔥 CREATE OR GET FLAT
    ===================================================== */

    let flat = await Flat.findOne({
      societyId,
      wing: normalizedWing,
      flatNo: normalizedFlatNo
    });

    if (!flat) {
      flat = await Flat.create({
        societyId,
        wing: normalizedWing,
        flatNo: normalizedFlatNo,
        isSubscribed: !!limitCheck.subscription // 🔥 ADDED
      });
    }

    /* =====================================================
       🚫 PREVENT DUPLICATE FLAT ASSIGNMENT
    ===================================================== */

    const flatExists = await Invite.findOne({
      societyId,
      flatId: flat._id,
      status: { $in: ["PENDING", "USED"] },
      roles: { $in: ["ADMIN", "OWNER"] }
    });

    if (flatExists) {
      return res.status(409).json({
        message: `Flat ${normalizedWing}-${normalizedFlatNo} already assigned`
      });
    }

    /* =====================================================
       ⏳ EXPIRY
    ===================================================== */

    const expiresAt = new Date(
      Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000
    );

    /* =====================================================
       🔍 CHECK EXISTING INVITE
    ===================================================== */

    let invite = await Invite.findOne({
      mobile,
      societyId,
      roles: { $in: ["ADMIN","OWNER"] }
    });

    if (invite && invite.status === "USED") {
      return res.status(409).json({
        message: "Admin or Owner already onboarded with this number"
      });
    }

    /* =====================================================
       🔄 UPDATE OR CREATE
    ===================================================== */

    if (invite) {
      invite.name = name;
      invite.email = email;
      invite.flatNo = normalizedFlatNo;
      invite.wing = normalizedWing;
      invite.flatId = flat._id;
      invite.status = "PENDING";
      invite.expiresAt = expiresAt;
      invite.invitedBy = req.user.userId;
      invite.roles = ["ADMIN","OWNER"];

      await invite.save();

      await auditLogger({
        req,
        action: "UPDATE_ADMIN_INVITE",
        targetType: "INVITE",
        targetId: invite._id,
        societyId,
        description: `Admin invite updated | Wing ${normalizedWing} Flat ${normalizedFlatNo}`
      });

      return res.json({
        message: "Existing admin invite updated",
        invite
      });
    }

    /* =====================================================
       🆕 CREATE INVITE
    ===================================================== */

    invite = await Invite.create({
      name,
      mobile,
      email,
      wing: normalizedWing,
      flatNo: normalizedFlatNo,
      flatId: flat._id,
      roles: ["ADMIN", "OWNER"],
      societyId,
      invitedBy: req.user.userId,
      expiresAt
    });

    await auditLogger({
      req,
      action: "CREATE_ADMIN_INVITE",
      targetType: "INVITE",
      targetId: invite._id,
      societyId,
      description: `Admin invited | Wing ${normalizedWing} Flat ${normalizedFlatNo}`
    });

    return res.status(201).json({
      message: "Admin invite created",
      invite
    });

  } catch (error) {
    console.error("INVITE ADMIN ERROR:", error);

    return res.status(500).json({
      message: "Failed to create admin invite"
    });
  }
};

/**
 * GET ALL INVITES
 */
export const getAllInvites = async (req, res) => {
  const invites = await Invite.find()
    .populate("societyId", "name city")
    .sort({ createdAt: -1 });

  res.json(invites);
};


/**
 * CANCEL INVITE
 */
export const cancelInvite = async (req, res) => {
  const { id } = req.params;

  const invite = await Invite.findById(id);
  if (!invite || invite.status !== "PENDING") {
    return res.status(400).json({ message: "Invite not valid" });
  }

  invite.status = "EXPIRED";
  await invite.save();

  await auditLogger({
    req,
    action: "CANCEL_ADMIN_INVITE",
    targetType: "INVITE",
    targetId: invite._id,
    societyId: invite.societyId,
    description: `Invite cancelled for ${invite.name} (${invite.mobile})`
  });

  res.json({ message: "Invite cancelled" });
};


/**
 * INVITE RESIDENT
 */
export const inviteResident = async (req, res) => {
  try {
    const { name, mobile, email, flatNo, wing, role } = req.body;

    const userRole = role?.toUpperCase();

    if (!userRole || !["OWNER", "TENANT"].includes(userRole)) {
      return res.status(400).json({
        message: "Role must be OWNER or TENANT"
      });
    }

    if (!name || !mobile || !email || !flatNo || !wing) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const inviter = await User.findById(req.user.userId);

    if (!inviter || !inviter.societyId) {
      return res.status(403).json({
        message: "Society not found"
      });
    }

    /* =====================================================
       🔥 ADDED: CHECK SUBSCRIPTION LIMIT
    ===================================================== */
    const limitCheck = await checkFlatLimit(inviter.societyId);
    if (!limitCheck.allowed) {
      return res.status(403).json({
        message: limitCheck.message
      });
    }

    // 🔥 EXISTING VALIDATION (UNCHANGED)
    const { flat, error } = await validateFlatAccess(
      inviter.societyId,
      wing,
      flatNo
    );
    if (error) return res.status(403).json({ message: error });

    const isAdminInvitingOwner =
      inviter.roles.includes("ADMIN") && userRole === "OWNER";

    const isOwnerInvitingTenant =
      inviter.roles.includes("OWNER") &&
      userRole === "TENANT" &&
      inviter.flatNo === flatNo &&
      inviter.wing === wing;

    if (!isAdminInvitingOwner && !isOwnerInvitingTenant) {
      return res.status(403).json({
        message: "Not authorized to invite this role"
      });
    }

    const existingUser = await User.findOne({
      societyId: inviter.societyId,
      wing,
      flatNo,
      roles: { $in: [userRole] }
    });

    if (existingUser) {
      return res.status(409).json({
        message: `${userRole} already exists for this flat`
      });
    }

    const flatExists = await Invite.findOne({
      societyId: inviter.societyId,
      wing,
      flatNo,
      roles: { $in: [userRole] },
      status: { $in: ["PENDING", "USED"] }
    });

    if (flatExists) {
      return res.status(409).json({
        message: `${userRole} already invited for this flat`
      });
    }

    const expiresAt = new Date(
      Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000
    );

    let invite = await Invite.findOne({
      mobile,
      societyId: inviter.societyId,
      roles: { $in: [userRole] }
    });

    if (invite?.status === "USED") {
      return res.status(409).json({
        message: `${userRole} already onboarded`
      });
    }

    if (invite) {
      invite.name = name;
      invite.email = email;
      invite.flatNo = flatNo;
      invite.wing = wing;
      invite.flatId = flat._id;
      invite.status = "PENDING";
      invite.expiresAt = expiresAt;
      invite.invitedBy = inviter._id;
      invite.roles = [userRole];
      await invite.save();
    } else {
      invite = await Invite.create({
        name,
        mobile,
        email,
        wing,
        flatNo,
        flatId: flat._id,
        roles: [userRole],
        societyId: inviter.societyId,
        invitedBy: inviter._id,
        expiresAt
      });
    }

    await auditLogger({
      req,
      action: "INVITE_RESIDENT",
      targetType: "INVITE",
      targetId: invite._id,
      societyId: inviter.societyId,
      description: `${userRole} invited: ${name} (${mobile}) | Wing ${wing} Flat ${flatNo}`
    });

    return res.json({
      success: true,
      message: `${userRole} invite sent successfully`,
      invite
    });

  } catch (err) {
    console.error("INVITE ERROR:", err);
    return res.status(500).json({
      message: "Failed to invite resident"
    });
  }
};
/**
 * INVITE GUARD (unchanged)
 */
export const inviteGuard = async (req, res) => {
  try {
    const { name, mobile, email, shiftType, shiftStartTime, shiftEndTime } =
      req.body;

    if (!name || !mobile || !email || !shiftType || !shiftStartTime || !shiftEndTime) {
      return res.status(400).json({
        message: "Name, mobile, email and shift details are required"
      });
    }

    const admin = await User.findById(req.user.userId);

    if (!admin || !admin.societyId) {
      return res.status(403).json({
        message: "Admin society not found"
      });
    }

    const expiresAt = new Date(
      Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000
    );

    let invite = await Invite.findOne({
      mobile,
      societyId: admin.societyId,
      roles: { $in: ["GUARD"] }
    });

    if (invite && invite.status === "USED") {
      return res.status(409).json({
        message: "Guard already onboarded"
      });
    }

    if (invite) {
      invite.name = name;
      invite.email = email;
      invite.status = "PENDING";
      invite.expiresAt = expiresAt;
      invite.invitedBy = admin._id;
      invite.roles = ["GUARD"];
      invite.shiftType = shiftType;
      invite.shiftStartTime = shiftStartTime;
      invite.shiftEndTime = shiftEndTime;
      await invite.save();
    } else {
      invite = await Invite.create({
        name,
        mobile,
        email,
        roles: ["GUARD"],
        societyId: admin.societyId,
        invitedBy: admin._id,
        expiresAt,
        shiftType,
        shiftStartTime,
        shiftEndTime
      });
    }

    await auditLogger({
      req,
      action: "INVITE_GUARD",
      targetType: "INVITE",
      targetId: invite._id,
      societyId: admin.societyId,
      description: `Guard invited: ${name} (${mobile})`
    });

    return res.json({
      message: "Guard invite sent successfully",
      invite
    });

  } catch (err) {
    console.error("INVITE GUARD ERROR:", err);
    return res.status(500).json({
      message: "Failed to invite guard"
    });
  }
};


/**
 * INVITE ADMINS BULK (patched)
 */
export const inviteAdminsBulk = async (req, res) => {
  try {
    const { societyId, admins } = req.body;

    if (!societyId || !Array.isArray(admins) || admins.length === 0) {
      return res.status(400).json({
        message: "societyId and admins array required"
      });
    }

    if (admins.length > 100) {
      return res.status(400).json({
        message: "Maximum 100 admins allowed per request"
      });
    }

    const society = await Society.findById(societyId);

    if (!society) {
      return res.status(404).json({
        message: "Society not found"
      });
    }

    const createdInvites = [];
    const errors = [];

    for (const admin of admins) {
      try {
        let { name, mobile, email, wing, flatNo } = admin;

        // 🧹 Normalize
        name = name?.trim();
        mobile = mobile?.trim();
        email = email?.trim();
        wing = wing?.trim().toUpperCase();
        flatNo = flatNo?.trim();

        if (!name || !mobile || !email || !wing || !flatNo) {
          errors.push({ mobile, message: "Missing required fields" });
          continue;
        }

        /* =====================================================
           🔥 ADDED: CHECK SUBSCRIPTION LIMIT
        ===================================================== */
        const limitCheck = await checkFlatLimit(societyId);
        if (!limitCheck.allowed) {
          errors.push({
            mobile,
            message: limitCheck.message
          });
          continue;
        }

        /* =========================
           🔥 CREATE OR GET FLAT
        ========================= */

        let flat = await Flat.findOne({ societyId, wing, flatNo });

        if (!flat) {
          flat = await Flat.create({
            societyId,
            wing,
            flatNo,
            isSubscribed: !!limitCheck.subscription // 🔥 ADDED
          });
        }

        /* =========================
           🚫 DUPLICATE CHECK
        ========================= */

        const flatExists = await Invite.findOne({
          societyId,
          flatId: flat._id,
          status: { $in: ["PENDING", "USED"] }
        });

        if (flatExists) {
          errors.push({
            mobile,
            message: `Flat ${wing}-${flatNo} already assigned`
          });
          continue;
        }

        const expiresAt = new Date(
          Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000
        );

        let invite = await Invite.findOne({
          mobile,
          societyId,
          roles: { $in: ["ADMIN", "OWNER"] }
        });

        if (invite && invite.status === "USED") {
          errors.push({
            mobile,
            message: "Admin or owner already onboarded"
          });
          continue;
        }

        if (invite) {
          invite.name = name;
          invite.email = email;
          invite.flatNo = flatNo;
          invite.wing = wing;
          invite.flatId = flat._id;
          invite.status = "PENDING";
          invite.expiresAt = expiresAt;
          invite.invitedBy = req.user.userId;
          invite.roles = ["ADMIN", "OWNER"];

          await invite.save();

        } else {

          invite = await Invite.create({
            name,
            mobile,
            email,
            wing,
            flatNo,
            flatId: flat._id,
            roles: ["ADMIN", "OWNER"],
            societyId,
            invitedBy: req.user.userId,
            expiresAt
          });
        }
        console.log("Created invite:", invite);
        console.log("Error:", errors);

        await auditLogger({
          req,
          action: "CREATE_ADMIN_INVITE",
          targetType: "INVITE",
          targetId: invite._id,
          societyId,
          description: `Admin invited | Wing ${wing} Flat ${flatNo}`
        });

        createdInvites.push(invite);

      } catch (err) {
        console.error("Error processing admin invite:", err);
        errors.push({
          mobile: admin.mobile,
          message: err.message
        });
      }
    }

    return res.status(201).json({
      success: true,
      created: createdInvites.length,
      invites: createdInvites,
      errors
    });

  } catch (error) {
    console.error("BULK ADMIN INVITE ERROR:", error);

    return res.status(500).json({
      message: "Failed to create bulk admin invites"
    });
  }
};