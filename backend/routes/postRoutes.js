const express = require("express");
const {
  createPost,
  likePost,
  getPaginatedPosts,
  addComment,
  getCommentsForPost,
  updateComment,
  deleteComment,
} = require("../controllers/postController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Create post route (protected)
router.post("/create", authenticateToken, createPost);

// Like post route (protected)
router.post("/like", authenticateToken, likePost);

// Get paginated posts (public)
router.get("/all", getPaginatedPosts);

// Add comment to post route (protected)
router.post("/comment", authenticateToken, addComment);

// Get comments for a post route (public)
router.get("/:postId/comments", getCommentsForPost);

// Update comment on a post (protected)
router.put("/comment", authenticateToken, updateComment);

// Delete comment on a post (protected)
router.delete("/comment/:commentId", authenticateToken, deleteComment);

module.exports = router;
