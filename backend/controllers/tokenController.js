const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
let refreshTokens = []; // In-memory store for refresh tokens (can be replaced with DB)

// Generate Refresh Token
const generateRefreshToken = (userId) => {
  const refreshToken = uuidv4();
  refreshTokens.push({ token: refreshToken, userId });
  return refreshToken;
};

// Refresh Access Token
const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !refreshTokens.find((t) => t.token === refreshToken)) {
    return res.status(403).json({ message: "Refresh token is invalid" });
  }

  const user = refreshTokens.find((t) => t.token === refreshToken);
  const newAccessToken = jwt.sign(
    { userId: user.userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return res.status(200).json({ token: newAccessToken });
};

module.exports = { generateRefreshToken, refreshAccessToken };
