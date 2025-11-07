const Order = require("../models/order");
const Chef = require("../models/chefSchema");
const Food = require("../models/foodItems");
const Table = require("../models/tablesSchema");
const allocateTable = require("../utils/tableAllocator");

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderTime: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

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
      const tableNumber = await allocateTable(order._id);
      if (!tableNumber)
        return res.status(400).json({ message: "No tables available right now" });
      order.tableNumber = tableNumber;
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

// UPDATE order status (PUT /api/orders/:id)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Missing status" });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // If moving to completed, free resources (table/chef) similar to completeOrder
    if (status === "completed") {
      if (order.orderType === "dine-in" && order.tableNumber) {
        await Table.findOneAndUpdate(
          { tableNumber: order.tableNumber },
          { isReserved: false, currentOrder: null }
        );
      }
      if (order.assignedChef) {
        const chef = await Chef.findOne({ name: order.assignedChef });
        if (chef) {
          chef.isBusy = false;
          await chef.save();
        }
      }
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error("❌ Error updating order status:", err);
    res.status(500).json({ message: "Failed to update order status" });
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
        { isReserved: false, currentOrder: null }
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
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error("❌ Error deleting order:", err);
    res.status(500).json({ message: "Failed to delete order" });
  }
};


module.exports = { getOrders, createOrder, completeOrder, updateOrderStatus, deleteOrder };

