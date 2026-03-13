import Invite from "../models/Invite.js";
import User from "../models/User.js";
import Society from "../models/Society.js";
import GuardLoginLog from "../models/GuardLoginLog.js";
import EmailChangeRequest from "../models/EmailChangeRequest.js";
import { signToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { saveOtp, verifyOtp } from "../utils/otpStore.js";
import { generateOtp } from "../utils/generateOtp.js";
import { auditLogger } from "../utils/auditLogger.js";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";

/**
 * =====================================================
 * SEND OTP
 * =====================================================
 */
export const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number required" });
    }

    const superAdmin = await User.findOne({
      mobile,
      roles: "SUPER_ADMIN",
    });

    const adminInvite = await Invite.findOne({
      mobile,
      role: "ADMIN",
      expiresAt: { $gt: new Date() },
    });

    if (!superAdmin && !adminInvite) {
      return res.status(403).json({
        message: "Not allowed to request OTP",
      });
    }

    const email = superAdmin?.email || adminInvite?.email;

    if (!email) {
      return res.status(400).json({
        message: "Email not found for OTP",
      });
    }

    const otp = generateOtp();
    saveOtp({ mobile, email, otp });

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent successfully to email" });

  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};


/**
 * =====================================================
 * SEND OTP FOR MOBILE USERS
 * =====================================================
 */
export const sendOtpUser = async (req, res) => {
  try {

    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        message: "Mobile number required"
      });
    }

    const user = await Invite.findOne({ mobile });

    if (!user) {
      return res.status(403).json({
        message: "Account not approved yet. Please contact admin."
      });
    }

    const society = await Society.findById(user.societyId);

    if (society?.status === "BLOCKED") {
      return res.status(403).json({
        message: "Your society access has been suspended."
      });
    }

    if (user.status === "BLOCKED") {
      return res.status(403).json({
        message: "Your account has been blocked. Contact admin."
      });
    }

    if (user.status === "INACTIVE") {
      return res.status(403).json({
        message: "Your tenancy has ended. Please contact the flat owner."
      });
    }

    if (user.roles.includes("SUPER_ADMIN")) {
      return res.status(403).json({
        message: "Super admin login not allowed in mobile app"
      });
    }

    if (!user.email) {
      return res.status(400).json({
        message: "Email not found for OTP"
      });
    }

    const otp = generateOtp();

    saveOtp({
      mobile,
      email: user.email,
      otp
    });

    await sendOtpEmail(user.email, otp);

    return res.json({
      success: true,
      message: "OTP sent successfully",
      role: user.roles[0]
    });

  } catch (err) {

    console.error("SEND USER OTP ERROR:", err);

    return res.status(500).json({
      message: "Failed to send OTP"
    });

  }
};


/**
 * =====================================================
 * VERIFY OTP — SUPER ADMIN LOGIN
 * =====================================================
 */
export const verifyOtpLogin = async (req, res) => {

  try {

    const { mobile, otp } = req.body;

    const user = await User.findOne({
      mobile,
      roles: "SUPER_ADMIN",
    });

    if (!user) {
      return res.status(404).json({ message: "Super Admin not found" });
    }

    if (user.status === "BLOCKED") {
      return res.status(403).json({ message: "Account is blocked" });
    }

    const isValid = verifyOtp({
      mobile,
      email: user.email,
      otp,
    });

    if (!isValid) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    const token = signToken({
      userId: user._id,
      role: "SUPER_ADMIN",
      wing: user.wing || null
    });

    const refreshToken = signRefreshToken({
      userId: user._id
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ token, refreshToken });

  } catch (err) {

    console.error("VERIFY SUPER ADMIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });

  }
};


/**
 * =====================================================
 * VERIFY OTP — USER LOGIN
 * =====================================================
 */

export const verifyUserLogin = async (req, res) => {
  try {

    const { mobile, otp, fcmToken } = req.body;

    const invite = await Invite.findOne({ mobile });

    if (!invite) {
      return res.status(403).json({
        message: "You are not invited to this society."
      });
    }

    if (!invite.email) {
      return res.status(400).json({
        message: "Email not found for OTP verification"
      });
    }

    const isValid = verifyOtp({
      mobile,
      email: invite.email,
      otp
    });

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid OTP"
      });
    }

    let user = await User.findOne({ mobile });

    if (!user) {

      user = await User.create({
        name: invite.name,
        email: invite.email,
        mobile: invite.mobile,
        roles: invite.roles,
        societyId: invite.societyId,
        invitedBy: invite.invitedBy,

        // Wing support added
        wing: invite.wing,
        flatNo: invite.flatNo,

        shiftStartTime: invite.shiftStartTime,
        shiftEndTime: invite.shiftEndTime,
        shiftType: invite.shiftType
      });

      invite.status = "USED";
      await invite.save();
    }

    if (fcmToken) {

      if (!user.fcmTokens) {
        user.fcmTokens = [];
      }

      if (!user.fcmTokens.includes(fcmToken)) {
        user.fcmTokens.push(fcmToken);
        user.fcmUpdatedAt = new Date();
      }
    }

    const token = signToken({
      userId: user._id,
      roles: user.roles,
      societyId: user.societyId,
      wing: user.wing
    });

    const refreshToken = signRefreshToken({
      userId: user._id
    });

    user.refreshToken = refreshToken;

    await user.save();

    if (user.roles.includes("GUARD")) {

      await GuardLoginLog.create({
        guardId: user._id,
        societyId: user.societyId,
        wing: user.wing || null
      });

    }

    const requiresProfilePhoto = !user.profileImage;

    return res.json({
      token,
      refreshToken,
      roles: user.roles,
      societyId: user.societyId,

      wing: user.wing,
      flatNo: user.flatNo,

      requiresProfilePhoto,

      shiftStartTime: user.shiftStartTime,
      shiftEndTime: user.shiftEndTime,
      shiftType: user.shiftType
    });

  } catch (err) {

    console.error("VERIFY USER LOGIN ERROR:", err);

    return res.status(500).json({
      message: "Login failed"
    });

  }
};


/**
 * =====================================================
 * REFRESH ACCESS TOKEN
 * =====================================================
 */
export const refreshAccessToken = async (req, res) => {

  try {

    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required"
      });
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.userId).select("refreshToken roles societyId status wing flatNo");

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        message: "Invalid session"
      });
    }

    const token = signToken({
      userId: decoded.userId,
      roles: user.roles,
      societyId: user.societyId,
      wing: user.wing
    });

    res.json({ token });

  } catch (err) {

    return res.status(401).json({
      message: "Invalid refresh token"
    });

  }
};


/**
 * =====================================================
 * REQUEST EMAIL CHANGE
 * =====================================================
 */
export const requestEmailChange = async (req, res) => {

  try {

    const userId = req.user.userId;
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({ message: "New email is required" });
    }

    const user = await User.findById(userId);

    if (!user || !user.email) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.email === newEmail.toLowerCase()) {
      return res.status(400).json({ message: "New email must be different" });
    }

    const emailExists = await User.findOne({
      email: newEmail.toLowerCase(),
    });

    if (emailExists) {
      return res.status(409).json({ message: "Email already in use" });
    }

    await EmailChangeRequest.deleteOne({ userId });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await EmailChangeRequest.create({
      userId,
      oldEmail: user.email,
      newEmail,
      otp,
      expiresAt,
    });

    await sendOtpEmail(user.email, otp);

    res.json({
      message: "OTP sent to your current email for verification",
    });

  } catch (err) {

    console.error("REQUEST EMAIL CHANGE ERROR:", err);
    res.status(500).json({ message: "Failed to request email change" });

  }
};


/**
 * =====================================================
 * VERIFY EMAIL CHANGE
 * =====================================================
 */
export const verifyEmailChange = async (req, res) => {

  try {

    const userId = req.user.userId;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const request = await EmailChangeRequest.findOne({ userId });

    if (!request) {
      return res.status(404).json({
        message: "No email change request found",
      });
    }

    if (Date.now() > request.expiresAt) {
      await request.deleteOne();
      return res.status(400).json({ message: "OTP expired" });
    }

    if (request.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    const user = await User.findById(userId);

    user.email = request.newEmail;

    await user.save();

    await request.deleteOne();

    await auditLogger({
      req,
      action: "CHANGE_EMAIL",
      targetType: "USER",
      targetId: userId,
    });

    res.json({ message: "Email updated successfully" });

  } catch (err) {

    console.error("VERIFY EMAIL CHANGE ERROR:", err);
    res.status(500).json({ message: "Failed to verify email change" });

  }
};


/**
 * =====================================================
 * GET CURRENT USER PROFILE
 * =====================================================
 */
export const getMe = async (req, res) => {

  try {

    const user = await User.findById(req.user.userId).select(
      "name email mobile roles wing flatNo shiftStartTime shiftEndTime shiftType"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {

    res.status(500).json({ message: "Failed to fetch profile" });

  }
};


/**
 * =====================================================
 * LOGOUT USER
 * =====================================================
 */
export const logoutUser = async (req, res) => {

  try {

    const userId = req.user.userId;
    const { fcmToken } = req.body;

    const user = await User.findById(userId);

    if (fcmToken) {

      user.fcmTokens = user.fcmTokens.filter(
        (token) => token !== fcmToken
      );

    }

    user.refreshToken = null;

    await user.save();

    if (user.roles.includes("GUARD")) {

      await GuardLoginLog.findOneAndUpdate(
        {
          guardId: userId,
          logoutAt: null
        },
        {
          logoutAt: new Date()
        }
      );

    }

    res.json({ message: "Logged out successfully" });

  } catch (error) {

    console.error("LOGOUT ERROR:", error);

    res.status(500).json({ message: "Logout failed" });

  }
};