const express = require("express");
const router = express.Router();
const Table = require("../models/tablesSchema");

router.get("/", async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (err) {
    console.error("❌ Error fetching tables:", err);
    res.status(500).json({ message: "Server error while fetching tables" });
  }
});

module.exports = router;
