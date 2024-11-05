const express = require("express");
const { refreshAccessToken } = require("../controllers/tokenController");

const router = express.Router();

// Refresh access token route
router.post("/refresh", refreshAccessToken);

module.exports = router;
