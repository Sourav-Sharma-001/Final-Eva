const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { initializeChefs } = require("./controllers/chefControllers"); // ✅ Added

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB connected");
    await initializeChefs(); // ✅ Added — create 4 chefs automatically if not present
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
const foodRoutes = require("./routes/foodRoutes");
const userDetailsRoutes = require("./routes/userDetailsRoutes");
const orderRoutes = require("./routes/orderRoutes");
const chefRoutes = require("./routes/chefRoutes");

app.use("/api/foods", foodRoutes);
app.use("/api/userDetails", userDetailsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chefs", chefRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
