const Table = require("../models/tableSchema");

// assign first available table
const assignTable = async (orderId) => {
  const table = await Table.findOneAndUpdate(
    { isReserved: false },
    { $set: { isReserved: true, currentOrder: orderId } },
    { sort: { tableNumber: 1 }, new: true }
  );

  if (!table) return null; // no free table
  return table.tableNumber;
};

module.exports = assignTable;
