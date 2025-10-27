const express = require("express");
const router = express.Router();
const FoodItem = require("../models/FoodItem");

// POST — Add new food item
router.post("/", async (req, res) => {
  try {
    const newItem = new FoodItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET — Fetch all food items
router.get("/", async (req, res) => {
  try {
    const items = await FoodItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
