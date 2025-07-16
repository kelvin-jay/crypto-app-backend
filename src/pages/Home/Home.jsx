import React, { useContext, useEffect, useState } from 'react';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar'
import { CoinContext } from '../../context/CoinContext';
import Testimonies from './Testimonies';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Preloader from './Preloader';
import Tradewithus from './Tradewithus';
import Hero from './Hero';
import HeroReview from './HeroReview';
import CryptoAsset from './CryptoAsset';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import GlobalTrade from './GlobalTrade';
import Cards from './Cards';
import PromoBanner from './PromoBanner';
import HeroSection from './HeroSection';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Home() {
  const { allCoin, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [coinData, setCoinData] = useState({});

  const handleCoinClick = (coin) => {
    setSelectedCoin(coin);
    fetchCoinData(coin.id, coin.name);
  };

  const handleCoinChange = (e) => {
    const selectedCoinName = e.target.value;
    const selectedCoin = allCoin.find((coin) => coin.name === selectedCoinName);
    if (selectedCoin) {
      handleCoinClick(selectedCoin);
    }
  };

  const fetchCoinData = async (id, name) => {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=30`);
      const data = await response.json();
      setCoinData({
        labels: data.prices.map((price) => new Date(price[0]).toLocaleDateString()),
        datasets: [{
          label: name,
          data: data.prices.map((price) => price[1]),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const searchHandler = async (event) => {
    event.preventDefault();
    const coins = allCoin.filter((item) => {
      return item.name.toLowerCase().includes(searchTerm.toLowerCase())
    });
    setDisplayCoin(coins);
    // Optionally, auto-select the first coin if only one result
    if (coins.length === 1) {
      handleCoinClick(coins[0]);
    }
  };

  useEffect(() => {
    if (searchTerm === '') {
      setDisplayCoin(allCoin.slice(0, 10));
    } else {
      const coins = allCoin.filter((item) => {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase())
      });
      setDisplayCoin(coins);
    }
  }, [searchTerm, allCoin]);

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);

  return (
    <div>
      <Navbar />
      <div>
        <Preloader />
      </div>
      <div className="home">
        <div className="hero">
          <h1>Largest Crypto Marketplace</h1>
          <p>Welcome to the world's largest cryptocurrency marketplace.</p>
          <form onSubmit={searchHandler}>
            <input
              type="text"
              placeholder="Search crypto.."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleCoinChange(e);
              }}
              list="coins"
            />
            <datalist id="coins">
              {allCoin.filter((item) => {
                return item.name.toLowerCase().includes(searchTerm.toLowerCase())
              }).map((item) => (
                <option key={item.id} value={item.name}>{item.name}</option>
              ))}
            </datalist>
            <button type="submit">Search</button>
          </form>

          {/* Coin Info Card */}
          {selectedCoin && coinData.labels && (
            <div className="coin-info-card">
              <div className="coin-info-header">
                <img src={selectedCoin.image} alt={selectedCoin.name} width={40} height={40} />
                <div>
                  <h2>
                    {selectedCoin.name}
                    <span style={{ fontSize: '1rem', color: '#888', marginLeft: 8 }}>
                      ({selectedCoin.symbol.toUpperCase()})
                    </span>
                  </h2>
                  <p>
                    Current Price: <b>{currency.symbol}{selectedCoin.current_price.toLocaleString()}</b>
                  </p>
                  <p>
                    Market Cap: {currency.symbol}{selectedCoin.market_cap.toLocaleString()}
                  </p>
                  <p>
                    24h Change:{" "}
                    <span className={selectedCoin.price_change_percentage_24h > 0 ? "green" : "red"}>
                      {Math.floor(selectedCoin.price_change_percentage_24h * 100) / 100}%
                    </span>
                  </p>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <Line data={coinData} />
              </div>
        
<button
  style={{
    background: 'none',
    border: 'none',
    color: '#ffd700',
    fontSize: '1.3rem',
    position: 'absolute',
    top: 12,
    right: 18,
    cursor: 'pointer'
  }}
  onClick={() => setSelectedCoin(null)}
  aria-label="Close"
>
  ×
</button>
            </div>
          )}
        </div>
        <div className="crypto-table">
          <div className="table-layout">
            <p>#</p>
            <p>Coins</p>
            <p>Price</p>
            <p style={{ textAlign: "center" }}>24H Change</p>
            <p className="market-cap">Market Cap</p>
          </div>
          {displayCoin.slice(0, 10).map((item, index) => (
            <div className="table-layout" key={index} onClick={() => handleCoinClick(item)} style={{ cursor: 'pointer' }}>
              <p>{item.market_cap_rank}</p>
              <div>
                <img src={item.image} alt="" />
                <p>{item.name + " - " + item.symbol}</p>
              </div>
              <p>{currency.symbol} {item.current_price.toLocaleString()}</p>
              <p className={item.price_change_percentage_24h > 0 ? "green" : "red"}>
                {Math.floor(item.price_change_percentage_24h * 100) / 100}
              </p>
              <p className='market-cap'>{currency.symbol} {item.market_cap.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
      <Hero />
      <div>
        <HeroReview />
      </div>
      <div>
        <CryptoAsset />
      </div>
      <div>
        <GlobalTrade />
      </div>
      <div>
        <Cards />
      </div>
      <div>
        <HeroSection />
      </div>
      <div>
        {/* Other components */}
        <Testimonies />
      </div>
      <div>
        <Tradewithus />
      </div>
      <div>
        <PromoBanner />
      </div>
    </div>
  );
}

export default Home;