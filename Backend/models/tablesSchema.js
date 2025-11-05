const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    tableNumber: { type: Number, required: true, unique: true },
    isReserved: { type: Boolean, default: false },
    currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
    chairs: { type: Number, default: 4 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", tableSchema);
