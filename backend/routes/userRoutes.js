const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  followUser,
  getFollowers,
  getFollowing,
  unfollowUser,
  getPaginatedFollowers,
  getUserNotifications,
  loginUserById,
} = require("../controllers/userController");
const authenticateToken = require("../middleware/authMiddleware");
const { resetPassword } = require("../controllers/userController");

const db = require("../config/db");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Login by User ID route
router.post("/login-by-id", loginUserById);

// Protected route - User profile
router.get("/profile", authenticateToken, (req, res) => {
  const userId = req.user.userId;

  // Fetch user information explicitly from the database
  db.query("SELECT * FROM users WHERE id = ?", [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    res.status(200).json({
      message: "User profile data",
      user: {
        userId: user.id,
        name: user.username,
        email: user.email,
      },
    });
  });
});

// User logout route
router.post("/logout", authenticateToken, logoutUser);

// Password reset route
router.post("/reset-password", resetPassword);

// Get all users route (protected)
router.get("/all-users", authenticateToken, getAllUsers);

// Follow user route (protected)
router.post("/follow", authenticateToken, followUser);

// Get followers route (protected)
router.get("/followers", authenticateToken, getFollowers);

// Get following users route (protected)
router.get("/following", authenticateToken, getFollowing);

// Unfollow user route (protected)
router.post("/unfollow", authenticateToken, unfollowUser);

// Get paginated followers route (protected)
router.get("/followers", authenticateToken, getPaginatedFollowers);

// Get paginated following users route (protected)
router.get("/following", authenticateToken, getFollowing);

// Get user notifications (protected)
router.get("/notifications", authenticateToken, getUserNotifications);

// Export the router
module.exports = router;
