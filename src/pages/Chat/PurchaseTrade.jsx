import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBitcoin, FaEthereum, FaRegCreditCard, FaUniversity, FaTenge } from 'react-icons/fa';
import { SiTether } from 'react-icons/si';
import './PurchaseTrade.css';

const coins = [
  { symbol: 'BTC', name: 'Bitcoin', icon: <FaBitcoin color="#f7931a" /> },
  { symbol: 'ETH', name: 'Ethereum', icon: <FaEthereum color="#627eea" /> },
  { symbol: 'USDT', name: 'Tether', icon: <SiTether color="#26a17b" /> },
];

const mockPrices = {
  BTC: 65000,
  ETH: 3500,
  USDT: 1,
};

const MOONPAY_URL = "https://buy.moonpay.com?apiKey=YOUR_MOONPAY_PUBLIC_KEY&currencyCode=btc"; // Replace with your MoonPay public key

const PurchaseTrade = () => {
  const [coin, setCoin] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [history, setHistory] = useState([
    { id: 1, coin: 'BTC', amount: 0.001, usd: 65, date: '2024-06-21' },
    { id: 2, coin: 'ETH', amount: 0.02, usd: 70, date: '2024-06-20' },
  ]);
  const [showMoonPay, setShowMoonPay] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const price = mockPrices[coin];
  const usdAmount = Number(amount) || 0;
  const cryptoAmount = usdAmount / price || 0;
  const fee = usdAmount > 0 ? Math.max(2, usdAmount * 0.015) : 0;
  const total = usdAmount + fee;

  const handleBuy = async () => {
    if (!usdAmount) return;
    setProcessing(true);
    setSuccess(false);

    if (paymentMethod === 'Card') {
      try {
        const res = await fetch('http://localhost:4242/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ coin, usdAmount }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert('Payment error: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        alert('Network error: ' + err.message);
      }
      setProcessing(false);
    } else if (paymentMethod === 'MoonPay') {
      setShowMoonPay(true);
      setProcessing(false);
    } else {
      setTimeout(() => {
        setHistory([
          { id: Date.now(), coin, amount: cryptoAmount, usd: usdAmount, date: new Date().toISOString().slice(0, 10) },
          ...history,
        ]);
        setSuccess(true);
        setProcessing(false);
        setAmount('');
      }, 2000);
    }
  };

  const handleMoonPayClose = () => {
    setShowMoonPay(false);
    setSuccess(true);
    setHistory([
      { id: Date.now(), coin, amount: cryptoAmount, usd: usdAmount, date: new Date().toISOString().slice(0, 10) },
      ...history,
    ]);
    setAmount('');
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="purchase-bg">
      <div className="purchase-trade-container">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>
          <FaTenge style={{ color: "#007bff", marginRight: 8, verticalAlign: 'middle' }} />
          Purchase Crypto
        </h1>
        <div className="purchase-form beautiful-card">
          <label>
            Select Coin:
            <div className="coin-select">
              <select value={coin} onChange={e => setCoin(e.target.value)}>
                {coins.map(c => (
                  <option key={c.symbol} value={c.symbol}>{c.name}</option>
                ))}
              </select>
              <span className="coin-icon">{coins.find(c => c.symbol === coin)?.icon}</span>
            </div>
          </label>
          <label>
            Amount (USD):
            <input
              type="number"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount in USD"
            />
          </label>
          <div className="live-price">
            Current Price: 1 {coin} = ${price.toLocaleString()}
          </div>
          <label>
            Payment Method:
            <div className="payment-select">
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option value="Card">Card (Stripe)</option>
                <option value="MoonPay">MoonPay</option>
                <option value="Bank">Bank Transfer</option>
              </select>
              <span className="pay-icon">
                {paymentMethod === 'Card' && <FaRegCreditCard color="#007bff" />}
                {paymentMethod === 'MoonPay' && <FaTenge color="#26a17b" />}
                {paymentMethod === 'Bank' && <FaUniversity color="#6c757d" />}
              </span>
            </div>
          </label>
          <button
            className={`buy-btn${processing ? ' processing' : ''}`}
            disabled={!usdAmount || processing}
            onClick={handleBuy}
          >
            {processing ? 'Processing...' : 'Buy Now'}
          </button>
          {success && (
            <div className="purchase-success animate-pop">
              <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#28a745" />
                <path d="M14 25l7 7 13-13" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Purchase successful!
            </div>
          )}
        </div>

        <div className="order-summary beautiful-card">
          <h2>Order Summary</h2>
          <ul>
            <li>Coin: <b>{coin} {coins.find(c => c.symbol === coin)?.icon}</b></li>
            <li>Amount: <b>{usdAmount ? cryptoAmount.toFixed(6) : '--'} {coin}</b></li>
            <li>Payment: <b>{usdAmount ? `$${usdAmount}` : '--'}</b> ({paymentMethod})</li>
            <li>Fee: <b>{usdAmount ? `$${fee.toFixed(2)}` : '--'}</b></li>
            <li>Total: <b>{usdAmount ? `$${total.toFixed(2)}` : '--'}</b></li>
          </ul>
        </div>

        <div className="trade-history beautiful-card">
          <h2>Transaction History</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Coin</th>
                <th>Amount</th>
                <th>USD</th>
              </tr>
            </thead>
            <tbody>
              {history.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td>{tx.coin} {coins.find(c => c.symbol === tx.coin)?.icon}</td>
                  <td>{tx.amount}</td>
                  <td>${tx.usd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="security-notice beautiful-card">
          <strong>Security Notice:</strong> Always double-check wallet addresses and use 2FA for your account.
        </div>
      </div>

      {/* MoonPay Modal */}
      {showMoonPay && (
        <div className="moonpay-modal-bg" onClick={handleMoonPayClose}>
          <div className="moonpay-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={handleMoonPayClose}>×</button>
            <h2>Complete Your Payment with MoonPay</h2>
            <iframe
              title="MoonPay Payment"
              src={MOONPAY_URL.replace('currencyCode=btc', `currencyCode=${coin.toLowerCase()}`)}
              width="100%"
              height="550"
              style={{ border: 'none', borderRadius: 12 }}
              allow="accelerometer; autoplay; camera; gyroscope; payment"
            />
            <button className="moonpay-success-btn" onClick={handleMoonPayClose}>
              I have completed payment
            </button>
            <p className="moonpay-note">After payment, click the button above to record your purchase.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseTrade;