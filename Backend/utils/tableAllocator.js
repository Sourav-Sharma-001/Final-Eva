const Table = require("../models/tablesSchema");

const assignTable = async (orderId) => {
  try {
    // Find first available table (not reserved)
    const table = await Table.findOne({ isReserved: false }).sort({ tableNumber: 1 });

    if (!table) return null; // no free tables

    // Mark it as reserved
    table.isReserved = true;
    table.currentOrder = orderId;
    await table.save();

    return table.tableNumber;
  } catch (err) {
    console.error("❌ Error assigning table:", err);
    return null;
  }
};

module.exports = assignTable;
