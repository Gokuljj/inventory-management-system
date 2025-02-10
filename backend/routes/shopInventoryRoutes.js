const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  addProductToShop,
  getShopInventory,
  updateShopProduct,
  deleteShopProduct,
} = require("../controllers/shopInventoryController");

const router = express.Router();

// ✅ Add Master Product to Inventory
router.post("/", protect, authorizeRoles("shopOwner"), addProductToShop);

// ✅ Get Shop Owner's Inventory
router.get("/", protect, authorizeRoles("shopOwner"), getShopInventory);

// ✅ Update Price & Quantity
router.put("/:id", protect, authorizeRoles("shopOwner"), updateShopProduct);

// ✅ Remove Product from Inventory
router.delete("/:id", protect, authorizeRoles("shopOwner"), deleteShopProduct);

module.exports = router;
