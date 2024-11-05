const db = require("../config/db");
const { createNotification } = require("./notificationController");
const { addNotification } = require("../utils/notificationUtil");

// Create Post Controller
const createPost = (req, res) => {
  const userId = req.user.userId; // Extract user ID from request, set by auth middleware
  const { content } = req.body;

  // Validate input
  if (!content) {
    return res.status(400).json({ message: "Post content is required" });
  }

  // Insert the post into the database
  db.query(
    "INSERT INTO posts (user_id, content) VALUES (?, ?)",
    [userId, content],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      return res.status(201).json({
        message: "Post created successfully",
        postId: results.insertId,
      });
    }
  );
};

// Like Post Controller
const likePost = (req, res) => {
  const userId = req.user.userId;
  const { postId } = req.body;
  const io = req.app.get("io"); // Get io instance from app

  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  db.query(
    "INSERT INTO likes (user_id, post_id) VALUES (?, ?)",
    [userId, postId],
    async (err, results) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ message: "You have already liked this post" });
        }
        return res.status(500).json({ message: "Database error", error: err });
      }

      // Add notification for the post owner
      db.query(
        "SELECT user_id FROM posts WHERE id = ?",
        [postId],
        async (err, postResults) => {
          if (err || postResults.length === 0) {
            return res
              .status(500)
              .json({ message: "Error finding post owner", error: err });
          }

          const postOwnerId = postResults[0].user_id;
          if (postOwnerId !== userId) {
            try {
              await addNotification(
                postOwnerId,
                `Your post has been liked by user ${userId}`,
                "like",
                io
              );
            } catch (err) {
              return res
                .status(500)
                .json({ message: "Error creating notification", error: err });
            }
          }

          return res.status(201).json({ message: "Post liked successfully" });
        }
      );
    }
  );
};

// Get Paginated Posts Controller
const getPaginatedPosts = (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page
  const offset = (page - 1) * limit;

  db.query(
    `SELECT posts.id, posts.content, posts.created_at, users.username 
     FROM posts 
     JOIN users ON posts.user_id = users.id 
     ORDER BY posts.created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      return res.status(200).json({ page, limit, posts: results });
    }
  );
};

// Add Comment to Post Controller
const addComment = (req, res) => {
  const userId = req.user.userId; // Extract user ID from request, set by auth middleware
  const { postId, content } = req.body;

  // Validate input
  if (!postId || !content) {
    return res
      .status(400)
      .json({ message: "Post ID and content are required" });
  }

  // Insert comment into the database
  db.query(
    "INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)",
    [userId, postId, content],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      return res.status(201).json({
        message: "Comment added successfully",
        commentId: results.insertId,
      });
    }
  );
};

// Get Comments for a Post Controller
const getCommentsForPost = (req, res) => {
  const postId = req.params.postId; // Get postId from request parameters
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 comments per page
  const offset = (page - 1) * limit;

  // Validate postId
  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  // Query to get comments for a post with pagination
  db.query(
    `SELECT comments.id, comments.content, comments.created_at, users.username 
     FROM comments 
     JOIN users ON comments.user_id = users.id 
     WHERE comments.post_id = ?
     ORDER BY comments.created_at DESC
     LIMIT ? OFFSET ?`,
    [postId, limit, offset],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No comments found for this post" });
      }

      return res.status(200).json({ page, limit, comments: results });
    }
  );
};

// Update Comment Controller
const updateComment = (req, res) => {
  const userId = req.user.userId; // Extract user ID from request, set by auth middleware
  const { commentId, content } = req.body;

  // Validate input
  if (!commentId || !content) {
    return res
      .status(400)
      .json({ message: "Comment ID and new content are required" });
  }

  // Update the comment in the database
  db.query(
    "UPDATE comments SET content = ? WHERE id = ? AND user_id = ?",
    [content, commentId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Comment not found or user not authorized" });
      }

      return res.status(200).json({ message: "Comment updated successfully" });
    }
  );
};

// Delete Comment Controller
const deleteComment = (req, res) => {
  const userId = req.user.userId; // Extract user ID from request, set by auth middleware
  const { commentId } = req.params;

  // Validate input
  if (!commentId) {
    return res.status(400).json({ message: "Comment ID is required" });
  }

  // Delete the comment from the database
  db.query(
    "DELETE FROM comments WHERE id = ? AND user_id = ?",
    [commentId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Comment not found or user not authorized" });
      }

      return res.status(200).json({ message: "Comment deleted successfully" });
    }
  );
};

// Like Post Controller
const likeNotificationPost = (req, res) => {
  const userId = req.user.userId; // Extract user ID from request
  const { postId } = req.body;

  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  // Insert like into the database
  db.query(
    "INSERT INTO likes (user_id, post_id) VALUES (?, ?)",
    [userId, postId],
    (err, results) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ message: "You have already liked this post" });
        }
        return res.status(500).json({ message: "Database error", error: err });
      }

      // Trigger notification for post owner
      db.query(
        "SELECT user_id FROM posts WHERE id = ?",
        [postId],
        (err, result) => {
          if (err || result.length === 0) {
            return res
              .status(500)
              .json({ message: "Error retrieving post owner", error: err });
          }
          const postOwnerId = result[0].user_id;
          if (postOwnerId !== userId) {
            createNotification(postOwnerId, userId, "like", postId);
          }
        }
      );

      return res.status(201).json({ message: "Post liked successfully" });
    }
  );
};

// Add Comment to Post Controller
const addNotificationComment = (req, res) => {
  const userId = req.user.userId;
  const { postId, content } = req.body;

  if (!postId || !content) {
    return res
      .status(400)
      .json({ message: "Post ID and content are required" });
  }

  db.query(
    "INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)",
    [userId, postId, content],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      // Trigger notification for post owner
      db.query(
        "SELECT user_id FROM posts WHERE id = ?",
        [postId],
        (err, result) => {
          if (err || result.length === 0) {
            return res
              .status(500)
              .json({ message: "Error retrieving post owner", error: err });
          }
          const postOwnerId = result[0].user_id;
          if (postOwnerId !== userId) {
            createNotification(postOwnerId, userId, "comment", postId);
          }
        }
      );

      return res.status(201).json({
        message: "Comment added successfully",
        commentId: results.insertId,
      });
    }
  );
};

module.exports = {
  createPost,
  likePost,
  getPaginatedPosts,
  addComment,
  getCommentsForPost,
  updateComment,
  deleteComment,
  likeNotificationPost,
  addNotificationComment,
};
