const express = require("express");
const router = express.Router();
const Chef = require("../models/chefSchema");

// Get all chefs
router.get("/", async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a chef (mark busy / set availableAt / add order count)
router.put("/:id", async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id);
    if (!chef) return res.status(404).json({ message: "Chef not found" });

    const { isBusy, availableAt, orders } = req.body;

    if (isBusy !== undefined) chef.isBusy = isBusy;
    if (availableAt) chef.availableAt = availableAt;
    if (orders !== undefined) chef.orders = orders;

    const updated = await chef.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
