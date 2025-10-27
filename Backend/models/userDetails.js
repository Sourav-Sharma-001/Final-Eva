const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  party: { type: Number, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("userDetails", userDetailsSchema);
