const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { body, validationResult } = require("express-validator");
const Animal = require("../db/models/Animal");
const { authMiddleware, adminOnly } = require("../middleware/auth");

// ── MULTER IMAGE UPLOAD ──
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uid = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uid + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    allowed.test(path.extname(file.originalname).toLowerCase())
      ? cb(null, true)
      : cb(new Error("Images only (jpeg/jpg/png/gif/webp)"));
  },
});

// ── GET ALL ──
router.get("/", authMiddleware, async (req, res) => {
  try {
    const animals = await Animal.find().populate("shelter", "name location").sort({ createdAt: -1 });
    res.json(animals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET ONE ──
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id).populate("shelter", "name location");
    if (!animal) return res.status(404).json({ error: "Animal not found" });
    res.json(animal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CREATE (admin) ──
router.post(
  "/",
  authMiddleware,
  adminOnly,
  upload.single("image"),
  [body("name").trim().notEmpty(), body("species").trim().notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const data = { ...req.body };
      if (req.file) data.image = `/uploads/${req.file.filename}`;
      const animal = await Animal.create(data);
      res.status(201).json(animal);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ── UPDATE (admin) ──
router.put("/:id", authMiddleware, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const animal = await Animal.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!animal) return res.status(404).json({ error: "Animal not found" });
    res.json(animal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE (admin) ──
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id);
    if (!animal) return res.status(404).json({ error: "Animal not found" });
    res.json({ message: "Animal deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;