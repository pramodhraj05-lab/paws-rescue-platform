const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  species: { type: String, required: true, trim: true },
  breed: { type: String, trim: true },
  age: { type: Number, min: 0 },
  gender: { type: String, enum: ["Male", "Female", "Unknown"], default: "Unknown" },
  status: { type: String, enum: ["Available", "Adopted", "Medical Hold", "Pending"], default: "Available" },
  image: { type: String },
  notes: { type: String, trim: true },
  shelter: { type: mongoose.Schema.Types.ObjectId, ref: "Shelter" },
}, { timestamps: true });

module.exports = mongoose.model("Animal", animalSchema);