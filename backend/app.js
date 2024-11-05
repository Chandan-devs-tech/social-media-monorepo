const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const db = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const { initializeDatabase } = require("./models/index");
require("dotenv").config();
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Set up Express app and Socket.IO server
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes (after initializing app)
app.use(cors(corsOptions));

// Create HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = socketIo(server);

// Middleware to parse JSON
app.use(express.json());

// Initialize Database Models
initializeDatabase();

// Socket.IO connection setup
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Handle user joining a specific room
  socket.on("join", (userId) => {
    socket.join(userId.toString());
    console.log(`User ${userId} joined their notification room.`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Set Socket.IO instance in app
app.set("io", io);

// User routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/tokens", tokenRoutes);

// Test route to verify if the server is running
app.get("/", (req, res) => {
  res.send("Social Media API is running...");
});

// Starting the server (using `server.listen` instead of `app.listen`)
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
