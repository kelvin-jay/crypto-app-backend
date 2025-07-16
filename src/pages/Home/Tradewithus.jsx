import React, { useEffect } from 'react';
import './Tradewithus.css'
import why_trade from '../../assets/why_trade.png'
import sun from '../../assets/sun.png'
import AOS from 'aos';
import 'aos/dist/aos.css';

function Tradewithus() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <div className="home-container1" data-aos="fade-up">
      <div className="left-image-container1" data-aos="fade-right">
        <img src={sun} alt="Sun" className="star-image" data-aos="zoom-in" data-aos-delay="100" />
        <img src={why_trade} alt="Why Trade" className='left-image1' data-aos="fade-up" data-aos-delay="200" />
        <div className="triangle" data-aos="fade-in" data-aos-delay="400"></div>
      </div>
      <div className="right-content1" data-aos="fade-left">
        <h3 data-aos="fade-down" data-aos-delay="100">Why Trade With us</h3>
        <h1 data-aos="fade-up" data-aos-delay="200">Trade Genius</h1>
        <p data-aos="fade-up" data-aos-delay="300">
          Trading is the art and science of buying and selling financial instruments, such as stocks, bonds, currencies.
        </p>
        <a href="#" className="learn-more" id='tagmore' data-aos="zoom-in" data-aos-delay="400">
          Learn more
          <svg width="20" height="20" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 5L8 5" stroke="#333" strokeWidth="2" />
            <path d="M5 2L5 8" stroke="#333" strokeWidth="2" transform="rotate(45 5 5)" />
          </svg>
        </a>

        <h1 data-aos="fade-up" data-aos-delay="500">Trade Apex</h1>
        <p data-aos="fade-up" data-aos-delay="600">
          Trading is the art and science of buying and selling financial instruments, such as stocks, bonds, currencies, commodities, and cryptocurrencies, with the aim of making a profit.
        </p>
        <p data-aos="fade-up" data-aos-delay="700">
          It's a dynamic and multifaceted field that attracts professionals from around the world.
        </p>
        <a href="#" className="learn-more" id='tagmore' data-aos="zoom-in" data-aos-delay="800">
          Learn more
          <svg width="20" height="20" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 5L8 5" stroke="#333" strokeWidth="2" />
            <path d="M5 2L5 8" stroke="#333" strokeWidth="2" transform="rotate(45 5 5)" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default Tradewithus;