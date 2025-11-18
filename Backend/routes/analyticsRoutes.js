const express = require("express");
const router = express.Router();
const { getOrderStats, getTables, getChefsLive } = require("../controllers/analyticsController");

// GET /api/analytics/orders
router.get("/orders", getOrderStats);

// GET /api/analytics/tables
router.get("/tables", getTables);

// GET /api/analytics/chefs-live
router.get("/chefs-live", getChefsLive);

module.exports = router;
