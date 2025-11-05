const Order = require("../models/order");
const Chef = require("../models/chefSchema");
const Food = require("../models/foodItems");
const Table = require("../models/tablesSchema");
const allocateTable = require("../utils/tableAllocator");

// ✅ CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // Resolve avg prep times
    const resolvedItems = await Promise.all(
      orderData.items.map(async (item) => {
        const food = await Food.findById(item.itemId);
        return {
          ...item,
          avgPrep: food ? food.avgPrep : 5,
        };
      })
    );

    // Create base order
    const order = new Order({ ...orderData, items: resolvedItems });

    // Fetch chefs sorted by availability
    const chefs = await Chef.find().sort({ availableAt: 1 });
    const totalPrepTime = resolvedItems.reduce(
      (sum, item) => sum + (item.avgPrep || 0) * (item.quantity || 1),
      0
    );

    const assignedChef = chefs.length > 0 ? chefs[0] : null;
    const now = new Date();
    const chefAvailableTime = new Date(assignedChef?.availableAt || now);
    const startTime = chefAvailableTime > now ? chefAvailableTime : now;
    const availableAt = new Date(startTime.getTime() + totalPrepTime * 60000);

    if (assignedChef) {
      assignedChef.isBusy = true;
      assignedChef.availableAt = availableAt;
      assignedChef.orders += 1;
      await assignedChef.save();
      order.assignedChef = assignedChef.name;
    } else {
      order.assignedChef = "Unassigned";
    }

    // Assign table if dine-in
    if (orderData.orderType === "dine-in") {
      const table = await allocateTable();
      if (!table)
        return res.status(400).json({ message: "No tables available right now" });
      order.tableNumber = table.tableNumber;
    }

    order.totalPrepTime = totalPrepTime;
    order.availableAt = availableAt;
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// ✅ COMPLETE ORDER
const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Free table if dine-in
    if (order.orderType === "dine-in" && order.tableNumber) {
      await Table.findOneAndUpdate(
        { tableNumber: order.tableNumber },
        { isReserved: false, currentOrder: null }
      );
    }

    // Free chef
    if (order.assignedChef) {
      const chef = await Chef.findOne({ name: order.assignedChef });
      if (chef) {
        chef.isBusy = false;
        await chef.save();
      }
    }

    order.status = "completed";
    await order.save();
    res.json({ message: "Order completed successfully" });
  } catch (err) {
    console.error("❌ Error completing order:", err);
    res.status(500).json({ message: "Failed to complete order" });
  }
};

module.exports = { createOrder, completeOrder };
