const mongoose = require("mongoose");

const chefSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isBusy: { type: Boolean, default: false },
  availableAt: { type: Date, default: () => new Date() },
  orders: { type: Number, default: 0 },
});

module.exports = mongoose.model("Chef", chefSchema);
