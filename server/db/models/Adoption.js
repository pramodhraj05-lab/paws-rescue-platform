const mongoose = require("mongoose");

const adoptionSchema = new mongoose.Schema({
  animal: { type: mongoose.Schema.Types.ObjectId, ref: "Animal", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  adopterName: { type: String, required: true, trim: true },
  adopterEmail: { type: String, lowercase: true, trim: true },
  adopterPhone: { type: String, trim: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  notes: { type: String, trim: true },
  adoptionDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Adoption", adoptionSchema);
