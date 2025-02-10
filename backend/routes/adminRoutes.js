const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin Dashboard Route (Only accessible to Admins)
router.get("/", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

module.exports = router;
