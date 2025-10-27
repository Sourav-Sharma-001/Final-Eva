const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  avgPrep: { type: String, required: true },
  category: { type: String, required: true },
  inStock: { type: String, required: true },
  image: { type: String }, // optional, can store URL/base64 later
});

module.exports = mongoose.model("FoodItem", foodItemSchema);
