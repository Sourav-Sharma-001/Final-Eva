const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Chef = require("../models/chefSchema");
const Food = require("../models/foodItems");

// POST /api/orders - create new order
router.post("/", async (req, res) => {
  try {
    const orderData = req.body;

    // ✅ Resolve item prep times from DB
    const resolvedItems = await Promise.all(
      orderData.items.map(async (item) => {
        const food = await Food.findById(item.itemId);
        return {
          ...item,
          avgPrep: food ? food.avgPrep : 5,
        };
      })
    );

    const order = new Order({ ...orderData, items: resolvedItems });

    // ✅ Find the next available chef
    const chef = await Chef.findOne().sort({ availableAt: 1 });

    if (chef) {
      // ✅ Calculate total prep time dynamically
      const totalPrepTime = resolvedItems.reduce(
        (sum, item) =>
          sum + (item.avgPrep || 0) * (item.quantity || 1),
        0
      );
      const availableAt = new Date(Date.now() + totalPrepTime * 60000);

      // Update chef info
      chef.currentOrders += 1;
      chef.availableAt = new Date(Date.now() + totalPrepTime * 60 * 1000);
      chef.isBusy = true;
      await chef.save();

      // Assign to order
      order.assignedChef = chef.name;
      order.totalPrepTime = totalPrepTime;
      order.availableAt = availableAt; 
    } else {
      order.assignedChef = "Unassigned";
    }

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Error placing order:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
});

// GET /api/orders - fetch all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET /api/orders/:id - fetch specific order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

module.exports = router;
