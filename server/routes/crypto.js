import express from 'express';
import axios from 'axios';

const router = express.Router();

// 🧾 Buy with NOWPayments
router.post('/buy-crypto', async (req, res) => {
  const { coin, amount, address } = req.body;
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
          'x-api-key': process.env.NOWPAYMENTS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json({ invoice_url: response.data.invoice_url });
  } catch (err) {
    res.status(500).json({ error: 'NOWPayments failed' });
  }
});

// 🌕 MoonPay URL
router.post('/moonpay-url', (req, res) => {
  const { coin, amount, address } = req.body;
  const query = new URLSearchParams({
    apiKey: process.env.MOONPAY_PUBLIC_KEY,
    defaultCurrency: coin.toLowerCase(),
    baseCurrencyAmount: amount,
    baseCurrencyCode: 'usd',
    walletAddress: address,
    showWalletAddressForm: 'true',
    areFeesIncluded: 'true',
  });

  const moonpayUrl = `https://buy.moonpay.com?${query.toString()}`;
  res.json({ moonpayUrl });
});

// 📈 Market data
router.get('/markets', async (req, res) => {
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
  } catch {
    res.status(500).json({ error: 'Failed to fetch market data.' });
  }
});

// 📰 Crypto News
let cachedNews = null;
let cachedNewsTime = 0;

router.get('/cryptonews', async (req, res) => {
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
  } catch {
    res.status(500).json({ error: 'Failed to fetch news.' });
  }
});

export default router;
