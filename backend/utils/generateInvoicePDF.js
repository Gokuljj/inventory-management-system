const fs = require("fs");
const PDFDocument = require("pdfkit");
const qr = require("qr-image");

// ✅ Generate PDF Invoice
const generateInvoicePDF = (invoice, callback) => {
  const doc = new PDFDocument();
  const filePath = `./invoices/invoice_${invoice._id}.pdf`;

  doc.pipe(fs.createWriteStream(filePath));

  // 🔹 Header
  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.moveDown();
  
  // 🔹 Invoice Details
  doc.fontSize(12).text(`Invoice ID: ${invoice._id}`);
  doc.text(`Shop Owner ID: ${invoice.shopOwner}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.moveDown();

  // 🔹 Table Header
  doc.fontSize(14).text("Items:", { underline: true });
  doc.moveDown();

  // 🔹 Products List
  invoice.products.forEach((item, index) => {
    doc.fontSize(12).text(`${index + 1}. ${item.product} - ${item.quantity} x $${item.price}`, {
      indent: 20,
    });
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total Amount: $${invoice.totalAmount}`, { bold: true });

  // 🔹 QR Code (Optional for Online Payments)
  doc.moveDown();
  const qrCode = qr.imageSync(`Payment for Invoice ${invoice._id} - Total: $${invoice.totalAmount}`, { type: "png" });
  doc.image(qrCode, { fit: [100, 100], align: "center" });

  doc.end();

  // ✅ Callback after PDF is generated
  doc.on("finish", () => {
    callback(filePath);
  });
};

module.exports = generateInvoicePDF;
