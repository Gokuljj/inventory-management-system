const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const shopRoutes = require('./routes/shopRoutes');
const productRoutes = require("./routes/productRoutes");
const shopInventoryRoutes = require("./routes/shopInventoryRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");


dotenv.config();
// connect to db
connectDB();

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shop', shopRoutes);
app.use("/api/products", productRoutes);
app.use("/api/shop/inventory", shopInventoryRoutes);
app.use("/api/shop/invoices", invoiceRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));



// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port http://localhost:${PORT}`));

