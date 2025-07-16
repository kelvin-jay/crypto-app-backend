import React, { useEffect, useState } from "react";
import './TradingViewWidget.css'

const TradingViewWidget = ({ symbol = "AAPL" }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      console.log("TradingView script loaded");
      setScriptLoaded(true);
    };
    script.onerror = (error) => {
      console.error("Failed to load TradingView script", error);
      setError("Failed to load TradingView script");
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);
  

  useEffect(() => {
    if (scriptLoaded && window.TradingView) {
      try {
        const widget = new window.TradingView.widget({
          "height": 500,
          "width": "100%",
          "symbol": "COINBASE:BTCUSD",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#f1f3f6",
          "withdateranges": true,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "show_popup_button": true,
          "popup_width": "1000",
          "popup_height": "650",
          "container_id": "tradingview_e8bea"
        });
        console.log("TradingView widget created");
      } catch (error) {
        console.error("Failed to create TradingView widget", error);
        setError("Failed to create TradingView widget");
      }
    }
  }, [scriptLoaded, symbol]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="tradingview-widget-container">
      <div id="tradingview_e8bea"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener" target="_blank"></a>
      </div>
    </div>
  )
}

export default TradingViewWidget;

