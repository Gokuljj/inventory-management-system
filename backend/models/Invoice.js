const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    shopOwner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", required: true 
    },
    products: [
      {
        product: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "ShopProduct", required: true },
        quantity: { 
          type: Number, 
          required: true 
        },
        price: { 
          type: Number, 
          required: true 
        },
      },
    ],
    totalAmount: { 
      type: Number, 
      required: true 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
