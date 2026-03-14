import Society from "../models/Society.js";
import User from "../models/User.js";
import { auditLogger } from "../utils/auditLogger.js";

/**
 * CREATE SOCIETY
 */
export const createSociety = async (req, res) => {
  try {
    const { name, city, wings } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Society name required"
      });
    }

    /* =============================
       Normalize wings
    ============================= */

    let normalizedWings = [];

    if (Array.isArray(wings) && wings.length > 0) {
      normalizedWings = wings
        .map((w) => w.trim().toUpperCase())
        .filter(Boolean);
    }

    const society = await Society.create({
      name: name.trim(),
      city,
      wings: normalizedWings,
      createdBy: req.user.userId
    });

    await auditLogger({
      req,
      action: "CREATE_SOCIETY",
      targetType: "SOCIETY",
      targetId: society._id,
      societyId: society._id,
      description: `Society created: "${society.name}"`
    });

    res.status(201).json(society);

  } catch (error) {

    console.error("CREATE SOCIETY ERROR:", error);

    res.status(500).json({
      message: "Failed to create society"
    });
  }
};


/**
 * GET ALL SOCIETIES
 */
export const getAllSocieties = async (req, res) => {

  try {

    const societies = await Society.find()
      .sort({ createdAt: -1 });
    console.log(societies);
    res.json(societies);

  } catch (error) {

    console.error("GET SOCIETIES ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch societies"
    });

  }
};


/**
 * SOCIETY SUMMARY (UPDATED FOR OWNER / TENANT)
 */
export const getSocietySummary = async (req, res) => {

  try {

    const { id } = req.params;

    const society = await Society.findById(id);

    if (!society) {
      return res.status(404).json({
        message: "Society not found"
      });
    }

    const admins = await User.countDocuments({
      societyId: id,
      roles: "ADMIN"
    });

    const owners = await User.countDocuments({
      societyId: id,
      roles: "OWNER"
    });

    const tenants = await User.countDocuments({
      societyId: id,
      roles: "TENANT"
    });

    const guards = await User.countDocuments({
      societyId: id,
      roles: "GUARD"
    });

    res.json({
      societyId: id,
      societyName: society.name,
      city: society.city,
      wings: society.wings || [],
      admins,
      owners,
      tenants,
      guards
    });

  } catch (error) {

    console.error("SOCIETY SUMMARY ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch society summary"
    });

  }
};