const ShopProduct = require("../models/ShopProduct");
const Product = require("../models/Product");

// ✅ Add a Master Product to Shop Inventory
const addProductToShop = async (req, res) => {
  try {
    const { productId, price, quantity } = req.body;

    // console.log("📌 Received productId:", productId);

    const product = await Product.findById(productId);

    if (!product) {
      console.log("❌ Product not found in Master Product List:", productId);
      return res.status(404).json({ message: "Product not found" });
    }

    const shopProduct = new ShopProduct({
      shopOwner: req.user._id,
      product: productId,
      price,
      quantity,
    });

    const savedProduct = await shopProduct.save();
    // console.log("✅ Shop Product Added:", savedProduct);
    res.status(201).json(savedProduct);
  } catch (error) {
    // console.error("❌ Error adding product:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Shop Owner's Inventory
const getShopInventory = async (req, res) => {
  try {
    const inventory = await ShopProduct.find({ shopOwner: req.user._id }).populate("product");
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Price & Quantity
const updateShopProduct = async (req, res) => {
  try {
    const { price, quantity } = req.body;
    const shopProduct = await ShopProduct.findById(req.params.id);

    if (!shopProduct) return res.status(404).json({ message: "Product not found" });

    if (shopProduct.shopOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    shopProduct.price = price || shopProduct.price;
    shopProduct.quantity = quantity || shopProduct.quantity;

    const updatedProduct = await shopProduct.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Remove Product from Inventory
const deleteShopProduct = async (req, res) => {
  try {
    const shopProduct = await ShopProduct.findById(req.params.id);

    if (!shopProduct) return res.status(404).json({ message: "Product not found" });

    if (shopProduct.shopOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await shopProduct.deleteOne();
    res.json({ message: "Product removed from inventory" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addProductToShop, getShopInventory, updateShopProduct, deleteShopProduct };
