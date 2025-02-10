const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, authorizeRoles("shopOwner"), (req, res) => {
  res.json({ message: "Welcome, Shop Owner!" });
});

module.exports = router;
