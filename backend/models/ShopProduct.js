const mongoose = require("mongoose");

const shopProductSchema = new mongoose.Schema(
  {
    shopOwner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShopProduct", shopProductSchema);
