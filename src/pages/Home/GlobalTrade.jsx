import React, { useEffect } from 'react'
import './GlobalTrade.css'
import { NavLink } from 'react-router-dom';
import Gold_Xa from '../../assets/Gold_Xa.png'
import USOIL from '../../assets/USOIL.png'
import EURUSD from '../../assets/EURUSD.png'
import US_30 from '../../assets/US_30.png'
import APPLE from '../../assets/APPLE.png'
import AOS from 'aos';
import 'aos/dist/aos.css';

const instruments = [
  {
    img: Gold_Xa,
    name: "XAUUSD",
    leverage: "Customizable",
    spread: "11.2",
    swap: "Available",
    category: "Metals"
  },
  {
    img: USOIL,
    name: "USOIL",
    leverage: "1:200",
    spread: "1.2",
    swap: "Available",
    category: "Energies"
  },
  {
    img: EURUSD,
    name: "EURUSD",
    leverage: "Customizable",
    spread: "0.6",
    swap: "Available",
    category: "Currencies"
  },
  {
    img: US_30,
    name: "US30",
    leverage: "1:400",
    spread: "1.9",
    swap: "Available",
    category: "Indices"
  },
  {
    img: APPLE,
    name: "AAPL",
    leverage: "1:20",
    spread: "0.7",
    swap: "Available",
    category: "Stocks"
  }
];

const GlobalTrade = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <section className='main-contenter-5'>
      <div className="table-container" data-aos="fade-up">
        <h2 data-aos="fade-down">Trade assets from global markets</h2>
        <p data-aos="fade-up" data-aos-delay="100">
          Capitalize on every opportunity with the world’s most popular assets.
        </p>
        <table className="instrument-table" data-aos="zoom-in" data-aos-delay="200">
          <thead>
            <tr>
              <th>Instruments</th>
              <th>Leverage</th>
              <th>Avg. spread³, pips</th>
              <th>Swap-free</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {instruments.map((item, idx) => (
              <tr className="instrument-row" key={item.name}
                  data-aos="fade-up"
                  data-aos-delay={200 + idx * 100}
              >
                <td>
                  <div className="instrument-cell">
                    <img src={item.img} alt={item.name} className="instrument-img" />
                    <span className="instrument-name">{item.name}</span>
                  </div>
                </td>
                <td>{item.leverage}</td>
                <td>{item.spread}</td>
                <td>{item.swap}</td>
                <td>
                  <NavLink to="./" className="instrument-link">
                    {item.category}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="tabler-icon tabler-icon-chevron-right">
                      <path d="M9 6l6 6l-6 6"></path>
                    </svg>
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="instrument-category" data-aos="fade-up" data-aos-delay="800">
          <h2>Instrument Categories</h2>
          <ul>
            <li><strong>Metals:</strong> <span>XAUUSD</span></li>
            <li><strong>Energies:</strong> <span>USOIL</span></li>
            <li><strong>Currencies:</strong> <span>EURUSD</span></li>
            <li><strong>Indices:</strong> <span>US30</span></li>
            <li><strong>Stocks:</strong> <span>AAPL</span></li>
          </ul>
          <div className="button-container">
            <NavLink to="/register">
              <button className="btn" data-aos="zoom-in" data-aos-delay="900">Register</button>
            </NavLink>
            <NavLink to="/vps">
              <button className="btn-1" data-aos="zoom-in" data-aos-delay="1000">Try free demo</button>
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GlobalTrade