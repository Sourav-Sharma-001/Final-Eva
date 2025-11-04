const Chef = require("../models/chefSchema");

// Create default chefs if none exist
const initializeChefs = async () => {
  const count = await Chef.countDocuments();
  if (count === 0) {
    await Chef.insertMany([
      { name: "Manesh", isBusy: false, availableAt: new Date(), orders: 0 },
      { name: "Pritam", isBusy: false, availableAt: new Date(), orders: 0 },
      { name: "Yash", isBusy: false, availableAt: new Date(), orders: 0 },
      { name: "Tenzen", isBusy: false, availableAt: new Date(), orders: 0 },
    ]);    
    console.log("✅ Default chefs added");
  }
};

// Get all chefs
const getChefs = async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export
module.exports = { initializeChefs, getChefs };
