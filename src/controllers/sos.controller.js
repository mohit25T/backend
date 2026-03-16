import SOS from "../models/SOS.js";


// 🚨 Trigger SOS
export const triggerSOS = async (req, res) => {
  try {

      const { emergencyType } = req.body;
      const wing = req.body.wing || req.user.wing;
      const flatNo = req.body.flatNo || req.user.flatNo;
console.log("Triggering SOS with data:", { wing, flatNo, emergencyType });
    const userId = req.user.userId;
    const societyId = req.user.societyId;

    const sos = await SOS.create({
      userId,
      societyId,
      wing,
      flatNo,
      emergencyType
    });
      console.log("New SOS Triggered:", sos);

    res.status(201).json({
      success: true,
      message: "SOS triggered successfully",
      data: sos
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        message: "You already have an active SOS request"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// 🚨 Get Active SOS (Guard Dashboard)
export const getActiveSOS = async (req, res) => {
  try {

    const societyId = req.user.societyId;

    const sosList = await SOS.find({
      societyId,
      status: { $in: ["active", "responding"] }
    })
      .populate("userId", "name phone")
      .populate("respondedBy", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sosList.length,
      data: sosList
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// 🛡 Guard Respond
export const respondSOS = async (req, res) => {
  try {

    const { id } = req.params;

    const sos = await SOS.findById(id);

    if (!sos) {
      return res.status(404).json({
        message: "SOS not found"
      });
    }

    sos.status = "responding";
    sos.respondedBy = req.user.userId;

    await sos.save();

    res.json({
      success: true,
      message: "Guard responding to SOS",
      data: sos
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ✅ Resolve SOS
export const resolveSOS = async (req, res) => {
  try {

    const { id } = req.params;

    const sos = await SOS.findById(id);

    if (!sos) {
      return res.status(404).json({
        message: "SOS not found"
      });
    }

    sos.status = "resolved";
    sos.resolvedAt = new Date();

    await sos.save();

    res.json({
      success: true,
      message: "SOS resolved successfully",
      data: sos
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// 📊 SOS History (Admin Panel)
export const getSOSHistory = async (req, res) => {
  try {

    const societyId = req.user.societyId;

    const history = await SOS.find({ societyId })
      .populate("userId", "name wing flatNo")
      .populate("respondedBy", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: history.length,
      data: history
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};