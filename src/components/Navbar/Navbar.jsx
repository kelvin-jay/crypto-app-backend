import React, { useContext, useState } from 'react';
import './Navbar.css';
import logo2 from '../../assets/logo2.png';
import { CoinContext } from '../../context/CoinContext';
import { Link, NavLink } from 'react-router-dom';
import TradingViewTickerTape from "../TradingViewTickerTape";

function Navbar() {
  const { setCurrency } = useContext(CoinContext);
  const [showMenu, setShowMenu] = useState(false);

  const currencyHandler = (event) => {
    const selectedCurrency = event.target.value;
    switch (selectedCurrency) {
      case 'usd':
        setCurrency({ name: 'usd', symbol: '$' });
        break;
      case 'eur':
        setCurrency({ name: 'eur', symbol: '€' });
        break;
      case 'inr':
        setCurrency({ name: 'inr', symbol: '₹' });
        break;
      case 'ngn':
        setCurrency({ name: 'ngn', symbol: '₦' });
        break;
      case 'gbp':
        setCurrency({ name: 'gbp', symbol: '£' });
        break;
      case 'jpy':
        setCurrency({ name: 'jpy', symbol: '¥' });
        break;
      case 'aud':
        setCurrency({ name: 'aud', symbol: 'A$' });
        break;
      case 'cad':
        setCurrency({ name: 'cad', symbol: 'C$' });
        break;
      case 'chf':
        setCurrency({ name: 'chf', symbol: 'CHF' });
        break;
      case 'cny':
        setCurrency({ name: 'cny', symbol: '¥' });
        break;
      case 'sek':
        setCurrency({ name: 'sek', symbol: 'kr' });
        break;
      case 'nzd':
        setCurrency({ name: 'nzd', symbol: 'NZ$' });
        break;
      case 'sgd':
        setCurrency({ name: 'sgd', symbol: 'S$' });
        break;
      case 'hkd':
        setCurrency({ name: 'hkd', symbol: 'HK$' });
        break;
      case 'mxn':
        setCurrency({ name: 'mxn', symbol: '$' });
        break;
      case 'brl':
        setCurrency({ name: 'brl', symbol: 'R$' });
        break;

      case 'try':
        setCurrency({ name: 'try', symbol: '₺' });
        break;
      case 'zar':
        setCurrency({ name: 'zar', symbol: 'R' });
        break;
      case 'rub':
        setCurrency({ name: 'rub', symbol: '₽' });
        break;
      case 'pln':
        setCurrency({ name: 'pln', symbol: 'zł' });
        break;
      case 'dkk':
        setCurrency({ name: 'dkk', symbol: 'kr' });
        break;
      case 'nok':
        setCurrency({ name: 'nok', symbol: 'kr' });
        break;
      default :
        setCurrency({ name: 'usd', symbol: '$' });
        break;
    }
  };
  

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className='sticky-navbar'>
      <div style={{ height: '50px', width: '100%' }}>
        <TradingViewTickerTape />
      </div>
      <div className="navbar">
        <Link to="/">
          <img src={logo2} alt="Logo2" style={{ cursor: "pointer", width: "200px", height: "auto" }} />
        </Link>
  <div className="hamburger" onClick={toggleMenu}>
    <span></span>
    <span></span>
    <span></span>
  </div>
  <ul className={`nav-menu ${showMenu ? 'active' : ''}`}>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <NavLink to="/Trading">Trading</NavLink>
    </li>
    <li>
      <NavLink to="/Market">Market</NavLink>
    </li>
    <li>
      <Link to="/Features">Features</Link>
    </li>
    <li>
      <Link to="/Pricing">Pricing</Link>
    </li>
    <li>
      <NavLink to="/Company">Company</NavLink>
    </li>
    <div className="nav-right">
      <select value="usd" aria-label="Select currency" onChange={currencyHandler}>
        <option value="usd" key="usd">USD</option>
        <option value="eur" key="eur">EUR</option>
        <option value="inr" key="inr">INR</option>
        <option value="ngn" key="ngn">NGN</option>
      </select>
      <Link to="/login" className="login-btn">Login</Link>
      <Link to="/signup" className="signup-btn">Sign up</Link>
    </div>
  </ul>
</div>
    </div>
  );
}

export default Navbar;

