const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");
const upload = require("../utils/fileUpload"); // Middleware for image uploads

const router = express.Router();

// ✅ Admin can create a product
router.post("/", protect, authorizeRoles("admin"), upload.single("image"), createProduct);

// ✅ Get all products (public)
router.get("/", getProducts);

// ✅ Get a product by ID
router.get("/:id", getProductById);

// ✅ Admin can update a product
router.put("/:id", protect, authorizeRoles("admin"), upload.single("image"), updateProduct);

// ✅ Admin can delete a product
router.delete("/:id", protect, authorizeRoles("admin"), deleteProduct);

module.exports = router;
