const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String }, // Image URL
    category: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin ID
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
