const Order = require("../models/orderSchema");
const assignTable = require("../utils/assignTable");

const createOrder = async (req, res) => {
  try {
    const { orderType, items, user, totalAmount } = req.body;

    // create new order instance
    const newOrder = new Order({
      orderType,
      items,
      user,
      totalAmount,
    });

    // if dine-in, assign a table
    if (orderType === "dine-in") {
      const tableNumber = await assignTable(newOrder._id);
      if (!tableNumber)
        return res.status(400).json({ message: "No tables available right now" });

      newOrder.tableNumber = tableNumber;
    }

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const Table = require("../models/tableSchema");

const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // find order
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // update order status
    order.status = "completed";
    await order.save();

    // free the assigned table (if dine-in)
    if (order.orderType === "dine-in" && order.tableNumber) {
      await Table.findOneAndUpdate(
        { tableNumber: order.tableNumber, currentOrder: order._id },
        { $set: { isReserved: false, currentOrder: null } }
      );
    }

    res.status(200).json({ message: "Order completed successfully" });
  } catch (err) {
    console.error("Error completing order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createOrder, completeOrder };


