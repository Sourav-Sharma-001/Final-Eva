const express = require("express");
const router = express.Router();
const CompletedOrder = require("../models/completedOrder");

// POST /api/completed-orders - move completed order to history
router.post("/", async (req, res) => {
  try {
    const orderData = req.body;

    // ✅ Defensive check: ensure required fields exist
    if (!orderData || !orderData.items) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // ✅ Remove MongoDB _id if present (to prevent duplicate key error)
    if (orderData._id) delete orderData._id;

    const completed = new CompletedOrder(orderData);
    await completed.save();

    res.status(201).json({ message: "Order moved to completedOrders ✅" });
  } catch (err) {
    console.error("❌ Error saving completed order:", err);
    res.status(500).json({ message: "Failed to save completed order", error: err.message });
  }
});


// GET /api/completed-orders - fetch all completed orders
router.get("/", async (req, res) => {
  try {
    const data = await CompletedOrder.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch completed orders" });
  }
});

module.exports = router;
