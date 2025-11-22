const Order = require("../models/order");
const Table = require("../models/tablesSchema");
const CompletedOrder = require("../models/completedOrder");


// GET /api/analytics/orders
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await CompletedOrder.countDocuments();

    const orders = await CompletedOrder.find();

    const served = orders.filter(o => o.status === "served").length;
    const dineIn = orders.filter(o => o.orderType === "dine-in").length;
    const takeAway = orders.filter(o => o.orderType === "takeaway").length;

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

// GET /api/analytics/total-clients
const getTotalClients = async (req, res) => {
  try {
    const result = await CompletedOrder.aggregate([
      {
        $group: {
          _id: null,
          totalClients: { $sum: "$party" },
        },
      },
    ]);

    const totalClients = result[0]?.totalClients || 0;
    res.json({ totalClients });
  } catch (err) {
    console.error("❌ Error fetching total clients:", err);
    res.status(500).json({ message: "Failed to fetch total clients" });
  }
};

// DAILY served/dine-in/takeaway
const getOrderStatsDaily = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const orders = await CompletedOrder.find({
      completedAt: { $gte: start, $lte: end }
    });

    res.json({
      served: orders.length,
      dineIn: orders.filter(o => o.orderType === "dine-in").length,
      takeAway: orders.filter(o => o.orderType === "takeaway").length,
      totalOrders: orders.length
    });
  } catch (err) {
    res.status(500).json({ message: "Failed daily stats" });
  }
};


// WEEKLY
const getOrderStatsWeekly = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 7);

    const orders = await CompletedOrder.find({
      completedAt: { $gte: start, $lte: now }
    });

    res.json({
      served: orders.length,
      dineIn: orders.filter(o => o.orderType === "dine-in").length,
      takeAway: orders.filter(o => o.orderType === "takeaway").length,
      totalOrders: orders.length
    });
  } catch (err) {
    res.status(500).json({ message: "Failed weekly stats" });
  }
};


// MONTHLY
const getOrderStatsMonthly = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    const orders = await CompletedOrder.find({
      completedAt: { $gte: start, $lte: now }
    });

    res.json({
      served: orders.length,
      dineIn: orders.filter(o => o.orderType === "dine-in").length,
      takeAway: orders.filter(o => o.orderType === "takeaway").length,
      totalOrders: orders.length
    });
  } catch (err) {
    res.status(500).json({ message: "Failed monthly stats" });
  }
};

// DAILY REVENUE CHART
const getRevenueDailyChart = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const result = await CompletedOrder.aggregate([
      { $match: { completedAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    res.json({ amount: result[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: "Failed daily revenue chart" });
  }
};

// WEEKLY REVENUE CHART
const getRevenueWeeklyChart = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 7);

    const result = await CompletedOrder.aggregate([
      { $match: { completedAt: { $gte: start, $lte: now } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    res.json({ amount: result[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: "Failed weekly revenue chart" });
  }
};

// MONTHLY REVENUE CHART
const getRevenueMonthlyChart = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    const result = await CompletedOrder.aggregate([
      { $match: { completedAt: { $gte: start, $lte: now } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    res.json({ amount: result[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: "Failed monthly revenue chart" });
  }
};



module.exports = { 
  getOrderStats, 
  getTables, 
  getChefsLive, 
  getRevenue, 
  getTotalClients, 
  getOrderStatsDaily, 
  getOrderStatsWeekly, 
  getOrderStatsMonthly,
  getRevenueDailyChart,
  getRevenueWeeklyChart,
  getRevenueMonthlyChart 
};
