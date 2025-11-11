const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    tableNumber: { type: Number, required: true, unique: true },
    isReserved: { type: Boolean, default: false },
    currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
    chairs: { type: Number, default: 4 },
    type: {
      type: String,
      enum: ["manual", "dine-in"],
      default: "manual", // manually created tables by staff/frontend
    },
    reservedUntil: {
      type: Date,
      default: null, // used for dine-in tables to auto-release when time expires
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", tableSchema);
