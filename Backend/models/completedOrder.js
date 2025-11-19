const mongoose = require("mongoose");

const CompletedOrderSchema = new mongoose.Schema({
  orderId: Number,
  items: Array,
  orderType: String,
  tableNumber: Number,
  customerName: String,
  phoneNumber: String,
  address: String,
  totalAmount: Number,
  assignedChef: String,
  party: { type: Number, default: 2 },
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("CompletedOrder", CompletedOrderSchema);
