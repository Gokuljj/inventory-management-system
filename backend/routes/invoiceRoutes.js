const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { createInvoice, getInvoices } = require("../controllers/invoiceController");
const path = require("path");

const router = express.Router();

// ✅ Create Invoice & Generate PDF
router.post("/", protect, authorizeRoles("shopOwner"), createInvoice);

// ✅ Download Invoice PDF
router.get("/download/:id", protect, authorizeRoles("shopOwner"), (req, res) => {
  const filePath = path.join(__dirname, `../invoices/invoice_${req.params.id}.pdf`);
  res.download(filePath, `invoice_${req.params.id}.pdf`, (err) => {
    if (err) {
      res.status(500).json({ message: "Invoice not found" });
    }
  });
});

module.exports = router;
