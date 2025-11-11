const Order = require("../models/order");
const Chef = require("../models/chefSchema");
const Food = require("../models/foodItems");
const Table = require("../models/tablesSchema");

// GET ALL ORDERS
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderTime: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

// CREATE ORDER
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

    const order = new Order({ ...orderData, items: resolvedItems });

    // Chef assignment logic (unchanged)
    const chefs = await Chef.find().sort({ availableAt: 1 });
    const totalPrepTime = resolvedItems.reduce(
      (sum, item) => sum + (item.avgPrep || 0) * (item.quantity || 1),
      0
    );

    const now = new Date();
    const assignedChef = chefs.length > 0 ? chefs[0] : null;
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

    // ---------- DINE-IN: create table (NEW logic) ----------
    if (orderData.orderType === "dine-in") {
      // Count existing tables (manual + dine-in)
      const totalTables = await Table.countDocuments();

      if (totalTables >= 30) {
        return res.status(400).json({ message: "All tables occupied" });
      }

      // Find lowest unused tableNumber between 1..30
      const existing = await Table.find({}, "tableNumber").lean();
      const usedNumbers = new Set(existing.map((t) => t.tableNumber));
      let nextNumber = null;
      for (let i = 1; i <= 30; i++) {
        if (!usedNumbers.has(i)) {
          nextNumber = i;
          break;
        }
      }

      if (!nextNumber) {
        // Shouldn't happen because of earlier count check, but safe fallback
        return res.status(400).json({ message: "All tables occupied" });
      }

      // Create the dine-in table and reserve it
      const newTable = new Table({
        tableNumber: nextNumber,
        chairs: orderData.party || 2,
        type: "dine-in",
        isReserved: true,
        currentOrder: order._id,
        reservedUntil: availableAt,
      });

      await newTable.save();
      order.tableNumber = newTable.tableNumber;
    }

    // finalize order
    order.totalPrepTime = totalPrepTime;
    order.availableAt = availableAt;
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};

// COMPLETE ORDER
const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Free table if dine-in
    if (order.orderType === "dine-in" && order.tableNumber) {
      await Table.findOneAndUpdate(
        { tableNumber: order.tableNumber },
        { isReserved: false, currentOrder: null, reservedUntil: null }
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

    order.status = "served";
    await order.save();

    res.json({ message: "Order completed and table released", order });
  } catch (err) {
    console.error("❌ Error completing order:", err);
    res.status(500).json({ message: "Failed to complete order" });
  }
};

// UPDATE ORDER STATUS (TAKEAWAY logic preserved exactly)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // 🟢 For Takeaway: just mark as completed (UNCHANGED)
    if (order.orderType.toLowerCase() === "takeaway") {
      order.status = "not picked up"; 
      order.completedAt = new Date();
      await order.save();
      return res.json({ message: "Takeaway order marked completed", order });
    }

    // 🟢 For Dine-In: run normal table + chef logic (unchanged intent)
    if (order.orderType.toLowerCase() === "dine-in") {
      await Table.findOneAndUpdate(
        { tableNumber: order.tableNumber },
        { isReserved: false, currentOrder: null, reservedUntil: null }
      );

      const chef = await Chef.findOne({ name: order.assignedChef });
      if (chef) {
        chef.isBusy = false;
        chef.availableAt = new Date();
        await chef.save();
      }

      order.status = "served"; 
      order.completedAt = new Date();
      await order.save();
      return res.json({ message: "Dine-in order completed and table released", order });
    }

    res.status(400).json({ message: "Invalid order type" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE order (DELETE /api/orders/:id)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // free table if dine-in
    if (order.orderType === "dine-in" && order.tableNumber) {
      await Table.findOneAndUpdate(
        { tableNumber: order.tableNumber },
        { isReserved: false, currentOrder: null, reservedUntil: null }
      );
    }

    // free chef if assigned
    if (order.assignedChef) {
      const chef = await Chef.findOne({ name: order.assignedChef });
      if (chef) {
        chef.isBusy = false;
        await chef.save();
      }
    }

    await Order.findByIdAndDelete(id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting order:", err);
    res.status(500).json({ message: "Failed to delete order" });
  }
};



module.exports = { getOrders, createOrder, completeOrder, updateOrderStatus, deleteOrder };
