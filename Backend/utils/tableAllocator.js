const Table = require("../models/tablesSchema");

const assignTable = async (orderId) => {
  try {
    // Count total tables
    const totalTables = await Table.countDocuments();

    // If less than 30 tables, create a new one automatically
    let table;
    if (totalTables < 30) {
      table = new Table({
        tableNumber: totalTables + 1,
        chairs: 4, // default chairs, can adjust as needed
        isReserved: true,
        currentOrder: orderId,
        name: `Table ${totalTables + 1}`,
      });
      await table.save();
      return table.tableNumber;
    }

    // If 30 tables exist, find first unreserved one
    table = await Table.findOne({ isReserved: false }).sort({ tableNumber: 1 });
    if (!table) return null; // all tables are reserved

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
