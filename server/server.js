require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./db/connection");

const app = express();

// Connect to MongoDB
// connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Paws Rescue API is running", status: "OK" });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🐾 Server running on http://localhost:${PORT}`);
});