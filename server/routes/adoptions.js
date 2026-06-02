
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Adoption = require("../db/models/Adoption");
const Animal = require("../db/models/Animal");
const { authMiddleware, adminOnly } = require("../middleware/auth");

// ── TRACK BY EMAIL OR ID (public) ──
router.get("/track", async (req, res) => {
  const { email, id } = req.query;
  if (!email && !id) return res.status(400).json({ error: "Provide email or id" });

  try {
    let adoptions;
    if (id) {
      const one = await Adoption.findById(id).populate("animal", "name species image");
      adoptions = one ? [one] : [];
    } else {
      adoptions = await Adoption.find({ adopterEmail: email.toLowerCase().trim() })
        .populate("animal", "name species image");
    }
    if (!adoptions.length) return res.status(404).json({ error: "No adoption request found" });
    res.json(adoptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET ALL ──
router.get("/", authMiddleware, async (req, res) => {
  try {
    const adoptions = await Adoption.find()
      .populate("animal", "name species image")
      .sort({ createdAt: -1 });
    res.json(adoptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CREATE (logged-in user) ──
router.post(
  "/",
  authMiddleware,
  [body("animal").notEmpty(), body("adopterName").trim().notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const animal = await Animal.findById(req.body.animal);
      if (!animal) return res.status(404).json({ error: "Animal not found" });
      if (animal.status === "Adopted") return res.status(400).json({ error: "Animal already adopted" });

      const adoption = await Adoption.create({
        ...req.body,
        user: req.user.id,
        status: "Pending",
      });
      res.status(201).json({
        ...adoption.toObject(),
        message: `Request submitted! Track using ID: ${adoption._id} or your email.`,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ── UPDATE STATUS (admin) ──
router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id);
    if (!adoption) return res.status(404).json({ error: "Adoption not found" });

    adoption.status = req.body.status || adoption.status;
    adoption.notes = req.body.notes ?? adoption.notes;
    await adoption.save();

    // Auto-update animal status
    if (req.body.status === "Approved") {
      await Animal.findByIdAndUpdate(adoption.animal, { status: "Adopted" });
    } else if (req.body.status === "Rejected") {
      await Animal.findByIdAndUpdate(adoption.animal, { status: "Available" });
    }

    res.json(adoption);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE (admin) ──
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const adoption = await Adoption.findByIdAndDelete(req.params.id);
    if (!adoption) return res.status(404).json({ error: "Adoption not found" });
    res.json({ message: "Adoption deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;