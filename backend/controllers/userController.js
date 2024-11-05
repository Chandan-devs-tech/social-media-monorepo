const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { generateRefreshToken } = require("./tokenController");
const { createNotification } = require("./notificationController");

// Register User Controller (already created)
const registerUser = (req, res) => {
  const { username, email, password } = req.body;

  // Check if the user already exists in the database
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the user's password and store it in the database
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error hashing password", error: err });
      }

      db.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hash],
        (err, results) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Database error", error: err });
          }

          return res
            .status(201)
            .json({ message: "User registered successfully" });
        }
      );
    });
  });
};

// User Login Controller
const loginUser = (req, res) => {
  const { email, password } = req.body;

  // Check if user exists in the database
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the password
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error comparing passwords", error: err });
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Generate refresh token
      const refreshToken = generateRefreshToken(user.id);

      // Return tokens
      return res
        .status(200)
        .json({ message: "Login successful", token, refreshToken });

      return res.status(200).json({ message: "Login successful", token });
    });
  });
};

// Login by User ID Controller
const loginUserById = (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.status(200).json({ message: "Login successful", token });
  });
};

// Logout User Controller
const logoutUser = (req, res) => {
  // Instruct the client to delete the token
  return res.status(200).json({
    message: "User logged out successfully.",
  });
};

// Password Reset Controller
const resetPassword = (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email and new password are required" });
  }

  // Hash new password
  bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error hashing password", error: err });
    }

    // Update user's password in the database
    db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hash, email],
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Password reset successfully" });
      }
    );
  });
};

// Get All Users Controller
const getAllUsers = (req, res) => {
  db.query("SELECT id, username, email FROM users", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({ users: results });
  });
};

// Follow User Controller
const followUser = (req, res) => {
  const followerId = req.user.userId;
  const { followedId } = req.body;

  if (!followedId) {
    return res.status(400).json({ message: "Followed user ID is required" });
  }

  if (followerId === followedId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  db.query(
    "INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)",
    [followerId, followedId],
    async (err, results) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ message: "You are already following this user" });
        }
        return res.status(500).json({ message: "Database error", error: err });
      }

      // Add notification for the followed user
      try {
        await addNotification(
          followedId,
          `You have a new follower: user ${followerId}`,
          "follow"
        );
      } catch (err) {
        return res
          .status(500)
          .json({ message: "Error creating notification", error: err });
      }

      return res.status(201).json({ message: "User followed successfully" });
    }
  );
};

// Get Followers Controller
const getFollowers = (req, res) => {
  const userId = req.user.userId; // Extract user ID from request, set by auth middleware

  // Query to get followers
  db.query(
    `SELECT users.id, users.username, users.email 
     FROM follows 
     JOIN users ON follows.follower_id = users.id 
     WHERE follows.followed_id = ?`,
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "No followers found" });
      }

      return res.status(200).json({ followers: results });
    }
  );
};

// Get Following Users Controller
const getFollowing = (req, res) => {
  const userId = req.user.userId; // Extract user ID from request, set by auth middleware

  // Query to get users the current user is following
  db.query(
    `SELECT users.id, users.username, users.email 
     FROM follows 
     JOIN users ON follows.followed_id = users.id 
     WHERE follows.follower_id = ?`,
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "No following users found" });
      }

      return res.status(200).json({ following: results });
    }
  );
};

// Unfollow User Controller
const unfollowUser = (req, res) => {
  const followerId = req.user.userId; // Extract the follower ID from the request
  const { followedId } = req.body;

  // Validate input
  if (!followedId) {
    return res.status(400).json({ message: "Followed user ID is required" });
  }

  // Check if the user is trying to unfollow themselves
  if (followerId === followedId) {
    return res.status(400).json({ message: "You cannot unfollow yourself" });
  }

  // Delete follow relationship from the database
  db.query(
    "DELETE FROM follows WHERE follower_id = ? AND followed_id = ?",
    [followerId, followedId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "You are not following this user" });
      }

      return res.status(200).json({ message: "User unfollowed successfully" });
    }
  );
};

// Get Paginated Followers Controller
const getPaginatedFollowers = (req, res) => {
  const userId = req.user.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.query(
    `SELECT users.id, users.username, users.email 
     FROM follows 
     JOIN users ON follows.follower_id = users.id 
     WHERE follows.followed_id = ?
     LIMIT ? OFFSET ?`,
    [userId, limit, offset],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      return res.status(200).json({ page, limit, followers: results });
    }
  );
};

// Get Paginated Following Users Controller
const getPaginatedFollowing = (req, res) => {
  const userId = req.user.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.query(
    `SELECT users.id, users.username, users.email 
     FROM follows 
     JOIN users ON follows.followed_id = users.id 
     WHERE follows.follower_id = ?
     LIMIT ? OFFSET ?`,
    [userId, limit, offset],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      return res.status(200).json({ page, limit, following: results });
    }
  );
};

// Follow User Controller
const followNotificationUser = (req, res) => {
  const followerId = req.user.userId;
  const { followedId } = req.body;

  if (!followedId) {
    return res.status(400).json({ message: "Followed user ID is required" });
  }

  if (followerId === followedId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  db.query(
    "INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)",
    [followerId, followedId],
    (err, results) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ message: "You are already following this user" });
        }
        return res.status(500).json({ message: "Database error", error: err });
      }

      // Trigger notification for followed user
      createNotification(followedId, followerId, "follow");

      return res.status(201).json({ message: "User followed successfully" });
    }
  );
};

// Get User Notifications Controller
const getUserNotifications = (req, res) => {
  const userId = req.user.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.query(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
    [userId, limit, offset],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      return res.status(200).json({ page, limit, notifications: results });
    }
  );
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  getAllUsers,
  followUser,
  getFollowers,
  getFollowing,
  unfollowUser,
  getPaginatedFollowers,
  getPaginatedFollowing,
  followNotificationUser,
  getUserNotifications,
  loginUserById,
};
