const express = require("express");
const router = express.Router();
const { getOrders, createOrder, completeOrder, updateOrderStatus, deleteOrder } = require("../controllers/orderControllers");

// ✅ Routes
router.get("/", getOrders);
router.post("/", createOrder);
router.patch("/:orderId/complete", completeOrder);
router.put("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;
