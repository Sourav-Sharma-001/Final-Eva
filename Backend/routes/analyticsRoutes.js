const express = require("express");
const router = express.Router();
const { getOrderStats, getTables, getChefsLive, getRevenue, getTotalClients } = require("../controllers/analyticsController");

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



module.exports = router;
