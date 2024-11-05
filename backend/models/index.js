const { createUsersTable } = require("./userModel");
const { createPostsTable } = require("./postModel");
const { createTokensTable } = require("./tokenModel");
const { createFollowsTable } = require("./followModel");
const { createCommentsTable } = require("./commentModel");
const { createNotificationsTable } = require("./notificationModel");
const { createLikesTable } = require("./likeModel");

// Initialize all tables
const initializeDatabase = () => {
  createUsersTable();
  createPostsTable();
  createTokensTable();
  createFollowsTable();
  createCommentsTable();
  createLikesTable();
  createNotificationsTable();
};

module.exports = { initializeDatabase };
