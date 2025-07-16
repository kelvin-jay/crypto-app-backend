import React, { useEffect } from 'react';
import './HeroReview.css';
import trade1 from '../../assets/trade1.jpg';
import trade2 from '../../assets/trade2.jpg';
import { NavLink } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HeroReview = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <div className="main2-container">
      {/* First section: image left, content right */}
      <div className="flex-container" data-aos="fade-up">
        <div className="right-content" data-aos="fade-up-right">
          <img src={trade1} alt="Trade" />
        </div>
        <div className="left-content" data-aos="fade-left">
          <div className="hero-main-info">
            <div className='svg-content' data-aos="zoom-in">
              {/* SVG ICON */}
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="36" stroke="#FFD700" strokeWidth="6" fill="#FFFBEA"/>
                <path d="M30 40L38 48L50 32" stroke="#FFD700" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Seize every opportunity</h2>
            <p>Trade online anytime, anywhere. On web, mobile and<br /> desktop.</p>
          </div>
          <div className="links-list" data-aos="fade-up" data-aos-delay="200">
            <ul>
              <li>
                <NavLink to="/" id='tag-1'>
                  MetaTrader 5
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="tabler-icon tabler-icon-chevron-right">
                    <path d="M9 6l6 6l-6 6"></path>
                  </svg>
                </NavLink>
                <NavLink to="/" id='tag-2'>
                  Exness Terminal
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="tabler-icon tabler-icon-chevron-right">
                    <path d="M9 6l6 6l-6 6"></path>
                  </svg>
                </NavLink>
                <NavLink to="/" id='tag-3'>
                  Exness Trade app
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="tabler-icon tabler-icon-chevron-right">
                    <path d="M9 6l6 6l-6 6"></path>
                  </svg>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Second section: content left, image right */}
      <div className="main-container-3" data-aos="fade-up">
        <div className="flex-1-container">
          <div className="left-content-1" data-aos="fade-right">
            <div className='svg-content-1' data-aos="zoom-in">
              {/* SVG ICON */}
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="12" y="20" width="56" height="40" rx="8" stroke="#FFD700" strokeWidth="6" fill="#FFFBEA"/>
                <path d="M28 40L36 48L52 32" stroke="#FFD700" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Your security is our priority</h2>
            <p>From secure payments to negative balance protection, you<br />are covered from every angle.</p>
            <ul>
              <li>
                <NavLink to="/" id='tag-1'>
                  Client protection
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="tabler-icon tabler-icon-chevron-right">
                    <path d="M9 6l6 6l-6 6"></path>
                  </svg>
                </NavLink>
                <NavLink to="/" id='tag-2'>
                  Why Crypto Asset Tradestop
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="tabler-icon tabler-icon-chevron-right">
                    <path d="M9 6l6 6l-6 6"></path>
                  </svg>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="right-content-2" data-aos="flip-left">
            <img src={trade2} alt="Trade 2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroReview;