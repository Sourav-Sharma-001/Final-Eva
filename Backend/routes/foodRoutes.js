const express = require("express");
const router = express.Router();
const FoodItem = require("../models/foodItems");

// Get all
router.get("/", async (req, res) => {
  try {
    const items = await FoodItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new
router.post("/", async (req, res) => {
  try {
    const newItem = new FoodItem(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
