import React, { useEffect } from 'react'
import './Hero.css'
import trade from '../../assets/trade.jpg';
import AOS from 'aos';
import 'aos/dist/aos.css';
// Import icons
import { FaMoneyCheckAlt, FaChartLine, FaHeadset, FaBolt, FaExchangeAlt, FaServer } from 'react-icons/fa';

const Hero = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <div className='hero-container'>
      <div className='sub-container' data-aos="fade-down">
        <h2>Thrive in the gold, oil, indices,and</h2>
        <h2>crypto markets</h2>
        <p>Trading conditions can make or break a strategy, that's why you need the best.</p>
      </div>
      <div className='main-container'>
        <div className='left-columns' data-aos="fade-right">
          <div className='content-container' data-aos="fade-up" data-aos-delay="100">
            <span><FaMoneyCheckAlt style={{marginRight: 8,}} />withdrawals</span>
            <h2><center>Instant withdrawals</center></h2>
            <p><center>Get your deposits and withdrawals</center><center> approved the moment you click the button.¹</center></p>
          </div>
          <div className='content-container' data-aos="fade-up" data-aos-delay="200">
            <span><FaChartLine style={{marginRight: 8,}} />Spreads</span>
            <h2><center>The best spreads² on gold</center></h2>
            <p><center>Trade with the tightest & most stable</center><center>Trade with the tightest & most stable</center><center> spreads in the market.</center></p>
          </div>
          <div className='content-container' data-aos="fade-up" data-aos-delay="300">
            <span><FaHeadset style={{marginRight: 8,}} />Support</span>
            <h2><center>24/7 live support</center></h2>
            <p><center>Get answers in minutes. Contact our</center><center> support team 24/7 by phone, email, or</center><center> live chat.</center></p>
          </div>
        </div>
        <div className='image1-container' data-aos="zoom-in">
          <img src={trade} alt="Trading" />
        </div>
        <div className='right-columns' data-aos="fade-left">
          <div className='content-container' data-aos="fade-up" data-aos-delay="100">
            <span><FaBolt style={{marginRight: 8,}} />Execution speed</span>
            <h2><center>Ultra-fast execution</center></h2>
            <p><center>Execute your orders in milliseconds</center><center> no matter how big they are.</center></p>
          </div>
          <div className='content-container' data-aos="fade-up" data-aos-delay="200">
            <span><FaExchangeAlt style={{marginRight: 8,}} />Swaps</span>
            <h2><center>No overnight fees</center></h2>
            <p><center>Hold your leveraged positions for as long as</center><center> you like, swap-free. T&C apply.</center></p>
          </div>
          <div className='content-container' data-aos="fade-up" data-aos-delay="300">
            <span><FaServer style={{marginRight: 8,}} />Platform</span>
            <h2><center>Reliable platforms</center></h2>
            <p><center>Experience the ultimate in stability and</center><center>execution speed. No matter the size of your</center><center> order.</center></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero