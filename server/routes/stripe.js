import dotenv from 'dotenv';
dotenv.config(); // 🔥 REQUIRED to load .env variables

import express from 'express';
import Stripe from 'stripe';

const router = express.Router();

// ✅ Ensure STRIPE_SECRET_KEY is defined before using
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const { coin, usdAmount } = req.body;
  if (!coin || !usdAmount || isNaN(usdAmount)) {
    return res.status(400).json({ error: 'Invalid coin or amount' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `Buy ${coin}` },
          unit_amount: Math.round(Number(usdAmount) * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:3000/purchase-trade?success=1&coin=' + coin,
      cancel_url: 'http://localhost:3000/purchase-trade?canceled=1',
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
