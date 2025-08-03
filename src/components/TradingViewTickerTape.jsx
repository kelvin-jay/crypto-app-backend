import React from 'react';

function TradingViewTickerTape() {
  return (
    
    <iframe
      src="https://s.tradingview.com/embed-widget/ticker-tape/?locale=en&theme=light&width=100%&height=50&symbols=%5B%7B%22proName%22%3A%22BITSTAMP%3ABTCUSD%22%2C%22title%22%3A%22BTCUSD%22%7D%2C%7B%22proName%22%3A%22BINANCE%3AETHUSDT%22%2C%22title%22%3A%22ETHUSDT%22%7D%2C%7B%22proName%22%3A%22BINANCE"
      width="100%"
      height="50"
      theme="dark"
      frameBorder="0"
      allowFullScreen
    ></iframe>
  );
}

export default TradingViewTickerTape;

