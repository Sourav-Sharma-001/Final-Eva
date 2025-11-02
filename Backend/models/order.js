const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: false },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  category: { type: String },
  averagePreparationTime: { type: Number }, // minutes
});

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    unique: true,
    default: () => Math.floor(Date.now() / 1000)
  },  
  items: { type: [ItemSchema], required: true },
  orderType: { type: String, enum: ["dine-in", "takeaway"], required: true },
  tableNumber: { type: Number, required: function () { return this.orderType === "dine-in"; } },
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: function () { return this.orderType === "takeaway"; } },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["processing", "ready", "served", "waiting_pickup", "picked_up", "done"],
    default: "processing"
  },
  orderTime: { type: Date, default: Date.now }, // set in backend when order saved
  // optional: assignment info for chefs
  assignments: [
    {
      chef: { type: String }, // chef id or name
      itemName: String,
      quantity: Number,
      startAt: Date,
      finishAt: Date,
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
