const Order = require("../models/order");

// GET /api/analytics/orders
const getOrderStats = async (req, res) => {
  try {
    const orders = await Order.find();

    const served = orders.filter(o => o.status === "served").length;
    const dineIn = orders.filter(o => o.orderType === "dine-in").length;
    const takeAway = orders.filter(o => o.orderType === "takeaway").length;
    const totalOrders = orders.length;

    res.json({ served, dineIn, takeAway, totalOrders });
  } catch (err) {
    console.error("❌ Error fetching order stats:", err);
    res.status(500).json({ message: "Failed to fetch order stats" });
  }
};

module.exports = { getOrderStats };
