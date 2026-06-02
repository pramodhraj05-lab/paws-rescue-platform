const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Shelter = require("../db/models/Shelter");
const Animal = require("../db/models/Animal");
const { authMiddleware, adminOnly } = require("../middleware/auth");

// ── GET ALL (with animal counts) ──
router.get("/", authMiddleware, async (req, res) => {
  try {
    const shelters = await Shelter.find().sort({ createdAt: -1 });
    const withCounts = await Promise.all(
      shelters.map(async (s) => {
        const count = await Animal.countDocuments({ shelter: s._id });
        return { ...s.toObject(), animalCount: count };
      })
    );
    res.json(withCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET ONE ──
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) return res.status(404).json({ error: "Shelter not found" });
    res.json(shelter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CREATE (admin) ──
router.post(
  "/",
  authMiddleware,
  adminOnly,
  [body("name").trim().notEmpty(), body("location").trim().notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const shelter = await Shelter.create(req.body);
      res.status(201).json(shelter);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ── UPDATE (admin) ──
router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const shelter = await Shelter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!shelter) return res.status(404).json({ error: "Shelter not found" });
    res.json(shelter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE (admin) ──
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const shelter = await Shelter.findByIdAndDelete(req.params.id);
    if (!shelter) return res.status(404).json({ error: "Shelter not found" });
    res.json({ message: "Shelter deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;