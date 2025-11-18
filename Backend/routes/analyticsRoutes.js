const express = require("express");
const router = express.Router();
const { getOrderStats } = require("../controllers/analyticsController");

// GET /api/analytics/orders
router.get("/orders", getOrderStats);

module.exports = router;
