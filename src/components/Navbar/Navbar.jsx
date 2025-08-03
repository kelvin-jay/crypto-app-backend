import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import logo2 from '../../assets/logo2.png';
import { CoinContext } from '../../context/CoinContext';
import { Link, NavLink } from 'react-router-dom';
import TradingViewTickerTape from "../TradingViewTickerTape";

function Navbar() {
  const { setCurrency } = useContext(CoinContext);
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const currencyHandler = (event) => {
    const currency = event.target.value;
    const symbols = {
      usd: '$', eur: '€', inr: '₹', ngn: '₦', gbp: '£', jpy: '¥', aud: 'A$',
      cad: 'C$', chf: 'CHF', cny: '¥', sek: 'kr', nzd: 'NZ$', sgd: 'S$',
      hkd: 'HK$', mxn: '$', brl: 'R$', try: '₺', zar: 'R', rub: '₽',
      pln: 'zł', dkk: 'kr', nok: 'kr'
    };
    setCurrency({ name: currency, symbol: symbols[currency] || '$' });
  };

  const toggleMenu = () => setShowMenu(!showMenu);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky-navbar">
      <div className="ticker-wrapper">
        <TradingViewTickerTape />
      </div>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/">
          <img src={logo2} alt="Logo2" className="logo" />
        </Link>

        <div className="hamburger" onClick={toggleMenu}>
          <span></span><span></span><span></span>
        </div>

        <ul className={`nav-menu ${showMenu ? 'active' : ''}`}>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/Trading">Trading</NavLink></li>
          <li><NavLink to="/Market">Market</NavLink></li>
          <li><NavLink to="/Features">Features</NavLink></li>
          <li><NavLink to="/Pricing">Pricing</NavLink></li>
          <li><NavLink to="/Company">Company</NavLink></li>

          <div className="nav-right">
            <select defaultValue="usd" onChange={currencyHandler}>
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="inr">INR</option>
              <option value="ngn">NGN</option>
            </select>
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/signup" className="signup-btn">Sign up</Link>
          </div>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
