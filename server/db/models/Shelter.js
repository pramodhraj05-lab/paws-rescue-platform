const mongoose = require("mongoose");

const shelterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, lowercase: true, trim: true },
  capacity: { type: Number, default: 50, min: 1 },
  latitude: { type: Number },
  longitude: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model("Shelter", shelterSchema);