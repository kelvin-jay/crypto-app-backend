import React, { useEffect } from 'react'
import './Cards.css'
import cryptoasset_minimum_deposit from '../../assets/cryptoasset_minimum_deposit.png'
import cryptoassetradestop from '../../assets/cryptoassetradestop.png'
import xl_99_slippage from '../../assets/xl_99_slippage.png'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Cards = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <div className="new-section-2" data-aos="fade-up">
      <h2 data-aos="fade-down">Keep up with Crypto Asset</h2>
      <p data-aos="fade-up" data-aos-delay="100">
        Stay on top of our news, product and technology updates, events, partnerships, and more.
      </p>
      <a href="#" className="read-more" data-aos="zoom-in" data-aos-delay="200">Read More Article</a>
      <div className="cards">
        <div className="card" data-aos="fade-right" data-aos-delay="100">
          <img src={cryptoasset_minimum_deposit} alt="Minimum Deposit" />
          <h3>Economic calender watch</h3>
          <p>Crypto Asset Tradestop minimum deposit: Begin trading with a cost-effective setup</p>
        </div>
        <div className="card" data-aos="fade-up" data-aos-delay="200">
          <img src={cryptoassetradestop} alt="Tradestop" />
          <h3>Crypto Asset Tradestop Advantages</h3>
          <p>An easy guide to unlocking extra income with the Exness Affiliate Program</p>
        </div>
        <div className="card" data-aos="fade-left" data-aos-delay="300">
          <img src={xl_99_slippage} alt="99% Slippage" />
          <h3>Crypto Asset Tradestop Advantages</h3>
          <p>The 99% slippage-free advantage: Why execution quality matters for traders</p>
        </div>
      </div>
    </div>
  )
}

export default Cards