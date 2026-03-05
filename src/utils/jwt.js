import jwt from "jsonwebtoken";

/* =========================================
   ACCESS TOKEN
========================================= */

// Generate Access Token
export const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Verify Access Token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};


/* =========================================
   REFRESH TOKEN
========================================= */

// Generate Refresh Token
export const signRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    //expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d"
  });
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};