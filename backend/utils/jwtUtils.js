const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, process.env.JWT_SECRET || "your_secret_key_here", {
    expiresIn,
  });
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your_secret_key_here");
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
