const express = require("express");
const router = express.Router();
const Table = require("../models/tablesSchema");

// ✅ Get all tables
router.get("/", async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (err) {
    console.error("❌ Error fetching tables:", err);
    res.status(500).json({ message: "Server error while fetching tables" });
  }
});

// ✅ Create a manual table
router.post("/manual", async (req, res) => {
  try {
    const { tableNumber, chairs } = req.body;
    const existing = await Table.findOne({ tableNumber });
    if (existing) {
      return res.status(400).json({ message: "Table number already exists" });
    }

    const newTable = new Table({
      tableNumber,
      chairs: chairs || 4,
      type: "manual",
      isReserved: false,
    });

    await newTable.save();
    res.status(201).json(newTable);
  } catch (err) {
    console.error("❌ Error creating manual table:", err);
    res.status(500).json({ message: "Server error while creating table" });
  }
});

// ✅ Delete a manual table
router.delete("/manual/:id", async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ message: "Table not found" });

    if (table.type !== "manual") {
      return res
        .status(400)
        .json({ message: "Only manually created tables can be deleted" });
    }

    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: "Manual table deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting manual table:", err);
    res.status(500).json({ message: "Server error while deleting table" });
  }
});

// ✅ Release a dine-in table after order completion
router.patch("/release/:id", async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ message: "Table not found" });

    table.isReserved = false;
    table.currentOrder = null;
    table.reservedUntil = null;
    await table.save();

    res.json({ message: "Table released successfully", table });
  } catch (err) {
    console.error("❌ Error releasing table:", err);
    res.status(500).json({ message: "Server error while releasing table" });
  }
});

// ✅ Create a manual table
router.post("/", async (req, res) => {
  try {
    const { chairs } = req.body;

    // Limit to 30 tables
    const totalTables = await Table.countDocuments();
    if (totalTables >= 30)
      return res.status(400).json({ message: "Table limit (30) reached" });

    // Auto-assign table number
    const newTableNumber = totalTables + 1;

    // Create manual table
    const newTable = new Table({
      tableNumber: newTableNumber,
      chairs: chairs || 2,
      isReserved: false,
      currentOrder: null,
      reservedUntil: null,
    });

    await newTable.save();
    res.status(201).json({ message: "Table created successfully", newTable });
  } catch (err) {
    console.error("Error creating table:", err);
    res
      .status(500)
      .json({ message: "Error creating table", error: err.message });
  }
});

// ✅ Delete a dine-in table by tableNumber (AUTO tables only)
router.delete("/dinein/:tableNumber", async (req, res) => {
  try {
    const table = await Table.findOne({ tableNumber: req.params.tableNumber });

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    // prevent deleting manual tables
    if (table.type === "manual") {
      return res
        .status(400)
        .json({ message: "Manual tables cannot be auto-deleted" });
    }

    await Table.findByIdAndDelete(table._id);
    res.json({ message: "Dine-in table deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting dine-in table:", err);
    res.status(500).json({ message: "Server error deleting table" });
  }
});




module.exports = router;
