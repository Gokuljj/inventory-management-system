const Invoice = require("../models/Invoice");
const ShopProduct = require("../models/ShopProduct");
const generateInvoicePDF = require("../utils/generateInvoicePDF");

// ✅ Create an Invoice
const createInvoice = async (req, res) => {
  try {
    const { products } = req.body;
    let totalAmount = 0;
    let invoiceProducts = [];

    for (let item of products) {
      const shopProduct = await ShopProduct.findById(item.product);
      if (!shopProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (shopProduct.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${shopProduct.product}` });
      }

      // ✅ Reduce stock
      shopProduct.quantity -= item.quantity;
      await shopProduct.save();

      totalAmount += item.quantity * shopProduct.price;

      invoiceProducts.push({
        product: shopProduct._id,
        quantity: item.quantity,
        price: shopProduct.price,
      });
    }

    const invoice = new Invoice({
      shopOwner: req.user._id,
      products: invoiceProducts,
      totalAmount,
    });

    const savedInvoice = await invoice.save();

    // ✅ Generate PDF Invoice
    generateInvoicePDF(savedInvoice, (filePath) => {
      console.log(`✅ PDF Invoice Generated: ${filePath}`);
    });

    res.status(201).json({ message: "Invoice created successfully", invoice: savedInvoice });
  } catch (error) {
    console.error("❌ Error creating invoice:", error);
    res.status(500).json({ message: error.message });
  }
};
// ✅ Get Shop Owner's Invoices
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ shopOwner: req.user._id }).populate("products.product");
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createInvoice, getInvoices };
