// Example for CryptoMarketTable.jsx
import React, { useEffect, useState } from 'react';

const CryptoMarketTable = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
  fetch('http://localhost:5000/api/markets')
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(setCoins)
    .catch(error => {
      console.error('Error fetching coins:', error);
      setCoins([]);
    });
}, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Coin</th>
          <th>Price</th>
          <th>24h</th>
          <th>Market Cap</th>
          <th>Volume</th>
        </tr>
      </thead>
      <tbody>
        {coins.map(coin => (
          <tr key={coin.id}>
            <td>
              <img src={coin.image} alt={coin.name} width={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />
              {coin.name} <span style={{ color: '#888', fontSize: 13 }}>{coin.symbol.toUpperCase()}</span>
            </td>
            <td>${coin.current_price.toLocaleString()}</td>
            <td style={{ color: coin.price_change_percentage_24h >= 0 ? '#4caf50' : '#e74c3c' }}>
              {coin.price_change_percentage_24h?.toFixed(2)}%
            </td>
            <td>${coin.market_cap.toLocaleString()}</td>
            <td>${coin.total_volume.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CryptoMarketTable;