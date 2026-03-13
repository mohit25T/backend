import User from "../models/User.js";
import Society from "../models/Society.js";
import Invite from "../models/Invite.js";
import VisitorLog from "../models/VisitorLog.js";

/**
 * ================================
 * GLOBAL OVERVIEW (Dashboard Cards)
 * ================================
 */
export const getOverviewAnalytics = async (req, res) => {

  const [
    totalSocieties,
    totalAdmins,
    totalOwners,
    totalTenants,
    totalGuards,
    totalInvites
  ] = await Promise.all([
    Society.countDocuments({ status: "ACTIVE" }),
    User.countDocuments({ roles: "ADMIN" }),
    User.countDocuments({ roles: "OWNER" }),
    User.countDocuments({ roles: "TENANT" }),
    User.countDocuments({ roles: "GUARD" }),
    Invite.countDocuments()
  ]);

  res.json({
    societies: totalSocieties,
    admins: totalAdmins,
    owners: totalOwners,
    tenants: totalTenants,
    guards: totalGuards,
    invites: totalInvites
  });
};


/**
 * ================================
 * SOCIETY ANALYTICS
 * ================================
 */
export const getSocietyAnalytics = async (req, res) => {

  const { societyId } = req.params;
  const { wing } = req.query;

  const society = await Society.findById(societyId);

  if (!society) {
    return res.status(404).json({
      message: "Society not found"
    });
  }

  const userQuery = { societyId };

  // Optional wing filter
  if (wing) {
    userQuery.wing = wing;
  }

  const [
    admins,
    owners,
    tenants,
    guards,
    visitors
  ] = await Promise.all([

    User.countDocuments({
      ...userQuery,
      roles: "ADMIN"
    }),

    User.countDocuments({
      ...userQuery,
      roles: "OWNER"
    }),

    User.countDocuments({
      ...userQuery,
      roles: "TENANT"
    }),

    User.countDocuments({
      ...userQuery,
      roles: "GUARD"
    }),

    VisitorLog.countDocuments({
      societyId,
      ...(wing ? { wing } : {})
    })

  ]);

  res.json({
    societyId,
    societyName: society.name,
    wing: wing || "ALL",
    admins,
    owners,
    tenants,
    guards,
    visitors
  });

};


/**
 * ================================
 * ADMIN PERFORMANCE ANALYTICS
 * ================================
 */
export const getAdminAnalytics = async (req, res) => {

  const { adminId } = req.params;

  const admin = await User.findById(adminId);

  if (!admin || !admin.roles.includes("ADMIN")) {
    return res.status(404).json({
      message: "Admin not found"
    });
  }

  const [ownersAdded, tenantsAdded, guardsAdded] = await Promise.all([

    User.countDocuments({
      invitedBy: adminId,
      roles: "OWNER"
    }),

    User.countDocuments({
      invitedBy: adminId,
      roles: "TENANT"
    }),

    User.countDocuments({
      invitedBy: adminId,
      roles: "GUARD"
    })

  ]);

  res.json({
    adminId,
    adminName: admin.name,
    adminWing: admin.wing || null,
    ownersAdded,
    tenantsAdded,
    guardsAdded
  });

};