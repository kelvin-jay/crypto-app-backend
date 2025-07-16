import React from "react";
import logo from "../assets/logo.png"; // Adjust the path if needed
import "./Loader.css";

const Loader = () => (
  <div className="loader-container">
    <div className="loader-logo-pulse">
      <div className="loader-spinner-ring"></div>
      <img src={logo} alt="CryptoApp Logo" className="loader-logo-img" />
    </div>
    <div className="loader-text">Loading Crypto App...</div>
  </div>
);

export default Loader;