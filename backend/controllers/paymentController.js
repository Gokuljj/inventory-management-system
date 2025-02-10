const Stripe = require("stripe");
const Invoice = require("../models/Invoice");
const dotenv = require("dotenv");

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // ✅ Use from .env

// ✅ Create Stripe Checkout Session
const createCheckoutSession = async (req, res) => {
  try {
    const { invoiceId } = req.body;

    // 🔹 Validate Invoice
    const invoice = await Invoice.findById(invoiceId).populate("products.product");
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // 🔹 Create Stripe line items with `product_data`
    const line_items = invoice.products.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {  // ✅ Ensure this exists
          name: item.product.name || "Unknown Product",
        },
        unit_amount: Math.round(item.price * 100), // ✅ Convert to cents (integer)
      },
      quantity: item.quantity,
    }));

    // 🔹 Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      // success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      // cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
      // success_url: "http://localhost:5000/payment-success?session_id={CHECKOUT_SESSION_ID}",
      // cancel_url: "http://localhost:5000/payment-failed",
      success_url: "https://eaf4-103-160-216-138.ngrok-free.app/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://eaf4-103-160-216-138.ngrok-free.app/payment-failed",

      metadata: { invoiceId: invoice._id.toString() },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("❌ Error creating checkout session:", error);
    res.status(500).json({ message: "Error creating checkout session", error });
  }
};



// ✅ Handle Stripe Webhook Events
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    // 🔹 Verify Webhook Event Signature
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const invoiceId = session.metadata.invoiceId;

      // 🔹 Mark Invoice as Paid in DB
      await Invoice.findByIdAndUpdate(invoiceId, { status: "Paid" });

      console.log(`✅ Invoice ${invoiceId} marked as Paid.`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

module.exports = { createCheckoutSession, handleStripeWebhook };
