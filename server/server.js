require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const connectDB = require("./db/connection");

const app = express();

// connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
const authRoutes = require("./routes/auth");
const animalRoutes = require("./routes/animals");
const shelterRoutes = require("./routes/shelters");
app.use("/shelters", shelterRoutes);
app.use("/auth", authRoutes);
app.use("/animals", animalRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Paws Rescue API is running", status: "OK" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🐾 Server running on http://localhost:${PORT}`);
});