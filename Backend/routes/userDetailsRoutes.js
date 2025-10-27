const express = require("express");
const router = express.Router();
const UserDetails = require("../models/userDetails");

// 🔹 Save user details
router.post("/", async (req, res) => {
  try {
    const user = new UserDetails(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Error saving user details:", err);
    res.status(500).json({ error: "Failed to save user details" });
  }
});

// 🔹 Get all user details (optional)
router.get("/", async (req, res) => {
  try {
    const users = await UserDetails.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});

module.exports = router;
