const Order = require("../models/order");
const Table = require("../models/tablesSchema");
const CompletedOrder = require("../models/completedOrder");


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

// GET /api/analytics/tables
const getTables = async (req, res) => {
  try {
    const tables = await Table.find();
    const reserved = tables.filter(t => t.isReserved).map(t => t.tableNumber);
    res.json({ reserved });
  } catch (err) {
    console.error("❌ Error fetching tables:", err);
    res.status(500).json({ message: "Failed to fetch tables" });
  }
};

// GET /api/analytics/chefs-live
const getChefsLive = async (req, res) => {
  try {
    const liveOrders = await Order.find({ status: { $ne: "served" } });
    
    const chefCounts = {};
    liveOrders.forEach((order) => {
      const chef = order.assignedChef || "Unassigned";
      chefCounts[chef] = (chefCounts[chef] || 0) + 1;
    });

    const result = Object.entries(chefCounts).map(([chefName, orders]) => ({
      chefName,
      liveOrders: orders,
    }));

    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching live chef orders:", err);
    res.status(500).json({ message: "Failed to fetch live chef orders" });
  }
};

// GET /api/analytics/revenue
const getRevenue = async (req, res) => {
  try {
    const result = await CompletedOrder.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalRevenue = result[0]?.totalRevenue || 0;
    res.json({ amount: totalRevenue });
  } catch (err) {
    console.error("❌ Error fetching total revenue:", err);
    res.status(500).json({ message: "Failed to fetch total revenue" });
  }
};




module.exports = { getOrderStats, getTables, getChefsLive, getRevenue };
