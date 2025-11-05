const express = require("express");
const router = express.Router();
const { createOrder, completeOrder } = require("../controllers/orderControllers");

// ✅ Routes
router.post("/", createOrder);
router.patch("/:orderId/complete", completeOrder);

module.exports = router;
