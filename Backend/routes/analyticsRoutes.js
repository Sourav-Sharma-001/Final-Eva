const express = require("express");
const router = express.Router();
const { 
  getOrderStats, 
  getTables, 
  getChefsLive, 
  getRevenue, 
  getTotalClients, 
  getOrderStatsDaily, 
  getOrderStatsWeekly, 
  getOrderStatsMonthly 
} = require("../controllers/analyticsController");

// GET /api/analytics/orders
router.get("/orders", getOrderStats);

// GET /api/analytics/tables
router.get("/tables", getTables);

// GET /api/analytics/chefs-live
router.get("/chefs-live", getChefsLive);

// GET /api/analytics/revenue
router.get("/revenue", getRevenue);

// GET /api/analytics/total-clients
router.get("/total-clients", getTotalClients);

router.get("/orders/daily", getOrderStatsDaily);
router.get("/orders/weekly", getOrderStatsWeekly);
router.get("/orders/monthly", getOrderStatsMonthly);



module.exports = router;
