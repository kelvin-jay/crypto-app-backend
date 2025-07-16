import React from 'react';
import './PromoBanner.css';
import star_focus from '../../assets/star_focus.png'; // Adjust the path as necessary

const PromoBanner = () => {
  return (
    <div className="promo-banner">
      <div className="promo-text">
        <h2>Start earning with only $100</h2>
        <p>Try our super easy portal for free</p>
      </div>

      <div className="promo-action">
        <div className="starburst-container">
          <img
            src={star_focus}
            alt="Starburst"
            className="starburst-image"
          />
          <div className="button-overlay">
            <button className="register-btn">Register →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
