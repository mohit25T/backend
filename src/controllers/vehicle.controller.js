import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";
import SocietySettings from "../models/SocietySettings.js";

/**
 * =====================================================
 * 🔧 Helper: normalize vehicle number
 * =====================================================
 */
const normalizeVehicleNumber = (vehicleNo) =>
    vehicleNo?.trim().toUpperCase();

/**
 * =====================================================
 * 1️⃣ Resident creates vehicle entry
 * =====================================================
 */
export const createVehicle = async (req, res) => {
    try {

        const {
            vehicleNumber,
            vehicleType,
            parkingSlot
        } = req.body;

        const societyId = req.user.societyId;
        const residentId = req.user.userId;

        if (!vehicleNumber || !vehicleType) {
            return res.status(400).json({
                message: "Vehicle number and type are required"
            });
        }

        const normalizedVehicleNumber =
            normalizeVehicleNumber(vehicleNumber);

        /* =====================================================
           🔍 STEP 1: Get Resident Info
        ===================================================== */

        const resident = await User.findById(residentId);

        if (!resident) {
            return res.status(404).json({
                message: "Resident not found"
            });
        }

        const flatNo = resident.flatNo;
        const wing = resident.wing; // ✅ ADDED

        /* =====================================================
           🔍 STEP 2: Get Society Vehicle Policy
        ===================================================== */

        const settings = await SocietySettings.findOne({
            societyId
        });

        const maxVehicles =
            settings?.vehicleSettings?.maxVehiclesPerFlat || 2;

        /* =====================================================
           🚫 STEP 3: Validate Vehicle Limit
        ===================================================== */

        const existingVehicles = await Vehicle.countDocuments({
            societyId,
            flatNo,
            wing // ✅ ADDED
        });

        if (existingVehicles >= maxVehicles) {
            return res.status(403).json({
                message: `Maximum ${maxVehicles} vehicles allowed for this flat`
            });
        }

        /* =====================================================
           🚫 STEP 4: Prevent Duplicate Vehicle
        ===================================================== */

        const duplicateVehicle = await Vehicle.findOne({
            societyId,
            vehicleNumber: normalizedVehicleNumber
        });

        if (duplicateVehicle) {
            return res.status(409).json({
                message: "Vehicle already registered in this society"
            });
        }

        /* =====================================================
           📝 STEP 5: Create Vehicle
        ===================================================== */

        const vehicle = await Vehicle.create({
            societyId,
            residentId,
            flatNo,
            wing, // ✅ ADDED
            vehicleNumber: normalizedVehicleNumber,
            vehicleType,
            parkingSlot
        });

        return res.status(201).json({
            success: true,
            message: "Vehicle added successfully",
            vehicle
        });

    } catch (error) {
        console.error("CREATE VEHICLE ERROR:", error);

        return res.status(500).json({
            message: error.message || "Server error"
        });
    }
};

/**
 * =====================================================
 * 2️⃣ Resident gets their vehicles
 * =====================================================
 */
export const getMyVehicles = async (req, res) => {
    try {

        const residentId = req.user.userId;
        const societyId = req.user.societyId;

        const vehicles = await Vehicle.find({
            residentId,
            societyId
        }).sort({ createdAt: -1 });

        return res.json({
            success: true,
            vehicles
        });

    } catch (error) {
        console.error("GET MY VEHICLES ERROR:", error);

        return res.status(500).json({
            message: error.message || "Server error"
        });
    }
};

/**
 * =====================================================
 * 3️⃣ Resident deletes vehicle
 * =====================================================
 */
export const deleteVehicle = async (req, res) => {
    try {

        const vehicleId = req.params.id;
        const residentId = req.user.userId;

        const vehicle = await Vehicle.findById(vehicleId);

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        if (vehicle.residentId.toString() !== residentId) {
            return res.status(403).json({
                message: "You are not allowed to delete this vehicle"
            });
        }

        await Vehicle.findByIdAndDelete(vehicleId);

        return res.json({
            success: true,
            message: "Vehicle removed successfully"
        });

    } catch (error) {
        console.error("DELETE VEHICLE ERROR:", error);

        return res.status(500).json({
            message: error.message || "Server error"
        });
    }
};

/**
 * =====================================================
 * 4️⃣ Admin / Guard gets vehicle list (WITH PAGINATION)
 * =====================================================
 */
export const getAllVehicles = async (req, res) => {
    try {

        const societyId = req.user.societyId;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const vehicles = await Vehicle.find({ societyId })
            .populate("residentId", "name flatNo wing mobile") // ✅ ADDED wing
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalVehicles = await Vehicle.countDocuments({
            societyId
        });

        return res.json({
            success: true,
            page,
            totalPages: Math.ceil(totalVehicles / limit),
            totalVehicles,
            vehicles
        });

    } catch (error) {
        console.error("GET ALL VEHICLES ERROR:", error);

        return res.status(500).json({
            message: error.message || "Server error"
        });
    }
};

/**
 * =====================================================
 * 5️⃣ Resident updates vehicle details
 * =====================================================
 */
export const updateVehicle = async (req, res) => {
    try {

        const vehicleId = req.params.id;

        const {
            vehicleNumber,
            vehicleType,
            parkingSlot
        } = req.body;

        const residentId = req.user.userId;
        const societyId = req.user.societyId;

        const vehicle = await Vehicle.findById(vehicleId);

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        if (vehicle.residentId.toString() !== residentId) {
            return res.status(403).json({
                message: "You are not allowed to update this vehicle"
            });
        }

        let normalizedVehicleNumber = vehicle.vehicleNumber;

        if (vehicleNumber) {
            normalizedVehicleNumber =
                vehicleNumber.trim().toUpperCase();
        }

        if (vehicleNumber) {

            const duplicateVehicle = await Vehicle.findOne({
                societyId,
                vehicleNumber: normalizedVehicleNumber,
                _id: { $ne: vehicleId }
            });

            if (duplicateVehicle) {
                return res.status(409).json({
                    message: "Vehicle number already exists in society"
                });
            }

            vehicle.vehicleNumber = normalizedVehicleNumber;
        }

        if (vehicleType) {
            vehicle.vehicleType = vehicleType;
        }

        if (parkingSlot !== undefined) {
            vehicle.parkingSlot = parkingSlot;
        }

        await vehicle.save();

        return res.json({
            success: true,
            message: "Vehicle updated successfully",
            vehicle
        });

    } catch (error) {
        console.error("UPDATE VEHICLE ERROR:", error);

        return res.status(500).json({
            message: error.message || "Server error"
        });
    }
};

/**
 * =====================================================
 * 6️⃣ Guard searches vehicle by number plate
 * =====================================================
 */
export const searchVehicle = async (req, res) => {
  try {

    const { vehicleNumber } = req.query;
    const societyId = req.user.societyId;

    if (!vehicleNumber) {
      return res.status(400).json({
        message: "Vehicle number is required"
      });
    }

    const normalizedVehicleNumber =
      vehicleNumber.trim().toUpperCase();

    const vehicle = await Vehicle.findOne({
      societyId,
      vehicleNumber: normalizedVehicleNumber
    }).populate("residentId", "name flatNo wing mobile"); // ✅ ADDED wing

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found in this society"
      });
    }

    return res.json({
      success: true,
      vehicle
    });

  } catch (error) {
    console.error("SEARCH VEHICLE ERROR:", error);

    return res.status(500).json({
      message: error.message || "Server error"
    });
  }
};