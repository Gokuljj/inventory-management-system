const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { createCheckoutSession, handleStripeWebhook } = require("../controllers/paymentController");


const router = express.Router();

router.get("/success", (req, res) => {
    res.send("✅ Payment Successful! (You can replace this with a real frontend later)");
  });

  router.get("/failed", (req, res) => {
    res.send("❌ Payment Failed! (You can replace this with a real frontend later)");
  });

// ✅ Create a Stripe Checkout Session
router.post("/create-checkout-session", protect, authorizeRoles("shopOwner"), createCheckoutSession);
// ✅ Stripe Webhook
router.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

module.exports = router;
