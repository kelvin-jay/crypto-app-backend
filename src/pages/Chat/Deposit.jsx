import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Deposit.css";
import Preloader from "../Home/Preloader";


// const MOONPAY_API_KEY = import.meta.env.VITE_MOONPAY_API_KEY;

const supportedCoins = [
  { symbol: "btc", name: "Bitcoin", logo: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
  { symbol: "eth", name: "Ethereum", logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
  { symbol: "usdt", name: "Tether (USDT)", logo: "https://assets.coingecko.com/coins/images/325/large/Tether.png" },
  { symbol: "ltc", name: "Litecoin", logo: "https://assets.coingecko.com/coins/images/2/large/litecoin.png" },
  { symbol: "bnb", name: "Binance Coin", logo: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png" },
  { symbol: "sol", name: "Solana", logo: "https://assets.coingecko.com/coins/images/4128/large/solana.png" },
  { symbol: "ada", name: "Cardano", logo: "https://assets.coingecko.com/coins/images/975/large/cardano.png" },
  { symbol: "trx", name: "TRON", logo: "https://assets.coingecko.com/coins/images/1094/large/tron.png" },
  { symbol: "doge", name: "Dogecoin", logo: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png" },
  { symbol: "matic", name: "Polygon", logo: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png" },
  { symbol: "shib", name: "Shiba Inu", logo: "https://assets.coingecko.com/coins/images/11939/large/shiba.png" },
  { symbol: "xrp", name: "XRP", logo: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png" },
];

const coingeckoIds = {
  btc: "bitcoin",
  eth: "ethereum",
  usdt: "tether",
  ltc: "litecoin",
  bnb: "binancecoin",
  sol: "solana",
  ada: "cardano",
  trx: "tron",
  doge: "dogecoin",
  matic: "matic-network",
  shib: "shiba-inu",
  xrp: "ripple",
};

const Deposit = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [coin, setCoin] = useState("btc");
  const [usdAmount, setUsdAmount] = useState("");
  const [coinPrice, setCoinPrice] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!coin) return;
    const fetchPrice = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoIds[coin]}&vs_currencies=usd`
        );
        const data = await res.json();
        setCoinPrice(data[coingeckoIds[coin]]?.usd || null);
      } catch {
        setCoinPrice(null);
      }
    };
    fetchPrice();
  }, [coin]);

  // const moonpayUrl =
  //   `https://buy.moonpay.com?apiKey=${MOONPAY_API_KEY}` +
  //   (walletAddress ? `&walletAddress=${encodeURIComponent(walletAddress)}` : "") +
  //   `&defaultCurrency=${encodeURIComponent(coin)}` +
  //   (usdAmount ? `&baseCurrencyAmount=${encodeURIComponent(usdAmount)}` : "");

  const estimatedCrypto =
    coinPrice && usdAmount && !isNaN(usdAmount)
      ? (parseFloat(usdAmount) / coinPrice).toFixed(6)
      : "";

  // Open MoonPay in a new tab
 const [loading, setLoading] = useState(false);

const handleBuyClick = async () => {
  setLoading(true);
  try {
    const res = await fetch("http://localhost:5000/api/moonpay-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coin,
        amount: usdAmount,
        address: walletAddress,
      }),
    });

    const data = await res.json();

    if (data.moonpayUrl) {
      window.open(data.moonpayUrl, "_blank", "noopener,noreferrer,width=500,height=700");
    } else {
      alert("Failed to generate MoonPay link.");
    }
  } catch (err) {
    console.error("MoonPay redirect error:", err);
    alert("An error occurred while generating the MoonPay link.");
  } finally {
    setLoading(false);
  }
};



  return (
    <div>
      <Preloader />
      <div className={`deposit-bg${darkMode ? " dark" : ""}`}>
        <div className="deposit-moonpay-adv">
          <div className="deposit-brand-bar">
            <img
              src={logo}
              alt="CryptoApp Logo"
              className="deposit-brand-logo-img"
              onClick={() => navigate("/dashboard")}
              style={{ cursor: "pointer" }}
            />
            <span className="deposit-brand-back" onClick={() => navigate("/dashboard")}>
              ← Back to Dashboard
            </span>
            <button
              className="dark-toggle-btn"
              onClick={() => setDarkMode((d) => !d)}
              aria-label="Toggle dark mode"
              type="button"
            >
              {darkMode ? "🌙" : "☀️"}
            </button>
          </div>

          <h2>Deposit Crypto with Credit/Debit Card</h2>
          <p>
            Enter your wallet address, select a coin, and amount in USD. You will be redirected to MoonPay to complete your purchase.
          </p>
          <form
            className="deposit-form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="deposit-form-group coin-select-group">
              <label htmlFor="coin">Select Coin:</label>
              <div className="coin-select-wrapper">
                <select
                  id="coin"
                  value={coin}
                  onChange={(e) => setCoin(e.target.value)}
                  className="deposit-select"
                  required
                >
                  {supportedCoins.map((c) => (
                    <option key={c.symbol} value={c.symbol}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <img
                  src={supportedCoins.find((c) => c.symbol === coin)?.logo}
                  alt={coin}
                  className="coin-logo"
                />
              </div>
            </div>
            <div className="deposit-form-group">
              <label htmlFor="usdAmount">Amount (USD):</label>
              <input
                type="number"
                id="usdAmount"
                value={usdAmount}
                onChange={(e) => setUsdAmount(e.target.value)}
                min="10"
                step="1"
                placeholder="Enter USD amount"
                required
                className="deposit-input"
              />
            </div>
            <div className="deposit-form-group">
              <label htmlFor="walletAddress">Your Wallet Address:</label>
              <input
                type="text"
                id="walletAddress"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder={`Paste your ${coin.toUpperCase()} wallet address`}
                required
                className="deposit-input"
              />
            </div>
          </form>

          {walletAddress && parseFloat(usdAmount) >= 10 && !isNaN(usdAmount) && (
            <>
              <div className="deposit-preview-card">
                <h4>Deposit Preview</h4>
                <p>
                  <strong>Coin:</strong>{" "}
                  <img
                    src={supportedCoins.find((c) => c.symbol === coin)?.logo}
                    alt={coin}
                    className="coin-logo"
                    style={{ marginLeft: 6, marginRight: 6, verticalAlign: "middle" }}
                  />
                  {supportedCoins.find((c) => c.symbol === coin)?.name}
                </p>
                <p>
                  <strong>Amount (USD):</strong> ${usdAmount}
                </p>
                <p>
                  <strong>Est. You Receive:</strong>{" "}
                  {estimatedCrypto && coinPrice
                    ? `${estimatedCrypto} ${coin.toUpperCase()}`
                    : "Loading..."}
                </p>
                <p>
                  <strong>Wallet Address:</strong> <span className="mono">{walletAddress}</span>
                </p>
              </div>

              <button
  className="moonpay-buy-btn"
  onClick={handleBuyClick}
  type="button"
  disabled={loading}
>
  {loading ? "Processing..." : "Buy with MoonPay"}
</button>

            </>
          )}

          <div className="deposit-watermark">
            <span role="img" aria-label="crypto">
              💸
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
