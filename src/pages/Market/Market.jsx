import React from 'react';
import CryptoMarketTable from './CryptoMarketTable';
import CryptoNews from './CryptoNews';
import './Market.css';
import Navbar from '../../components/Navbar/Navbar';

const Market = () => (
  <div>
    <Navbar />
  <div className="market-root">
    <div className="market-main">
      <h2 className="market-title">Crypto Markets</h2>
      <CryptoMarketTable />
    </div>
    <aside className="market-news">
      <h2 className="market-title">Latest Crypto News</h2>
      <CryptoNews />
    </aside>
  </div>
  </div>
);

export default Market;