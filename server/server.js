// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cryptoRoutes from './routes/crypto.js';
import stripeRoutes from './routes/stripe.js';
import kyc2faRoutes from './routes/kyc2fa.js'; // ✅ You mistakenly called this "kycRoutes" below

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', cryptoRoutes);         // CoinGecko, MoonPay, NOWPayments
app.use('/stripe', stripeRoutes);      // Stripe checkout
app.use('/', kyc2faRoutes);         // ✅ Correct name used here

// Default
app.get('/', (req, res) => res.send('Crypto App Backend API'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Unified server running on port ${PORT}`);
});
