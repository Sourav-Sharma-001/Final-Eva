const express = require("express");
const router = express.Router();
const { getOrders, createOrder, completeOrder } = require("../controllers/orderControllers");

// ✅ Routes
router.get("/", getOrders);
router.post("/", createOrder);
router.patch("/:orderId/complete", completeOrder);

module.exports = router;
