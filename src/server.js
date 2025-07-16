import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(cors());
app.use(express.json());

// 🌐 Environment Variables
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const MOONPAY_PUBLIC_KEY = process.env.MOONPAY_PUBLIC_KEY;

// ================================
// 🚀 NOWPayments: Create Invoice
// ================================
app.post('/api/buy-crypto', async (req, res) => {
  const { coin, amount, address } = req.body;
  if (!coin || !amount || !address) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const response = await axios.post(
      'https://api.nowpayments.io/v1/invoice',
      {
        price_amount: amount,
        price_currency: 'usd',
        pay_currency: coin.toLowerCase(),
        order_description: `Buy ${coin} for user`,
        is_fixed_rate: true,
      },
      {
        headers: {
          'x-api-key': NOWPAYMENTS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ invoice_url: response.data.invoice_url });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to create payment.' });
  }
});

// ================================
// 🌕 MoonPay: Generate URL (FIXED)
// ================================
app.post("/api/moonpay-url", async (req, res) => {
  const { coin, amount, address } = req.body;
  const moonpayApiKey = process.env.MOONPAY_PUBLIC_KEY;

  if (!moonpayApiKey || !coin || !amount || !address) {
    return res.status(400).json({ error: "Missing fields or API key." });
  }

  const query = new URLSearchParams({
    apiKey: moonpayApiKey,
    defaultCurrency: coin.toLowerCase(),
    baseCurrencyAmount: amount,
    baseCurrencyCode: 'usd',
    walletAddress: address,
    showWalletAddressForm: 'true',
    areFeesIncluded: 'true', // ✅ ensures fees are calculated
  });

  // Optional: specify crypto explicitly for better widget behavior
  if (coin === 'btc') {
    query.append('defaultCryptoCurrency', 'bitcoin');
  }

  const moonpayUrl = `https://buy.moonpay.com?${query.toString()}`;
  console.log("MoonPay URL:", moonpayUrl);
  return res.json({ moonpayUrl });
});



// ================================
// 📈 CoinGecko: Market Prices
// ================================
app.get('/api/markets', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 20,
          page: 1,
          sparkline: true,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch market data.' });
  }
});

// ================================
// 📰 CoinGecko: News with Cache
// ================================
let cachedNews = null;
let cachedNewsTime = 0;

app.get('/api/cryptonews', async (req, res) => {
  const now = Date.now();
  if (cachedNews && now - cachedNewsTime < 60000) {
    return res.json(cachedNews);
  }
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/status_updates',
      { params: { per_page: 20, page: 1 } }
    );
    cachedNews = response.data;
    cachedNewsTime = now;
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch news.' });
  }
});

// ================================
// 🔊 Start Server
// ================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
