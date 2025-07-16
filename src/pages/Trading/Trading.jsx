import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './Trading.css';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaChartLine, FaRocket, FaShieldAlt, FaPiggyBank, FaBriefcase } from 'react-icons/fa';
import button from '../../assets/button.png';
import Preloader from "../Home/Preloader";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Trading = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <div>
      <Navbar />
      <div>
        <Preloader />
      </div>
      <section className="hero-section" data-aos="fade-right">
        <div className="hero-content">
          <h1>Welcome to Our Trading Platform</h1>
          <p className="hero-description">
            Your journey to financial freedom starts here Join us today and experience the future of Trading
            <span className="highlight">Secure, Reliable, and Profitable. Join our community of successful traders
              We offer a range of trading plans tailored to your needs.</span><br />
          </p>
          <p className="hero-description2">
            Whether you're a beginner or an experienced trader, we have the perfect plan for you<br />
            Our platform is designed to help you succeed in the world of trading<br />
          </p>
          <Link to="/signup">
            <button className="hero-button"> Get Started <FaArrowRight className="icon" /> </button>
          </Link>
        </div>
        <div className="hero-image-container" data-aos="fade-left">
          <img src={button} alt={button} className="hero-image" />
        </div>
      </section>
      <section className="sub-container" data-aos="fade-up">
        <div className="container1">
          <div className="heading-container" data-aos="fade-down">
            <h3 className="motor">Our Trading plans</h3>
            <h2 className="motors">The plans we offer is specifically </h2>
            <h2 className="motorss">made for you</h2>
          </div>
          <div className="grid-container">
            <div className="grid-item" data-aos="fade-right">
              <div className="icon-container">
                <FaChartLine size={60} color="#4CAF50" />
                <span className="box-number">1</span>
              </div>
              <h1>BASIC</h1>
              <h3>Daily 15%</h3>
              <h3><span>Investment:</span> <span style={{ background: '#ddd', borderRadius: '5px', padding: '0 5px' }}>$20-$500</span></h3>
              <h3><span>Capital Back:</span> <span >Yes</span></h3>
              <h3><span>Return Type:</span> <span>Lifetime</span></h3>
              <h3><span>Number of Period</span><span>Unlimited</span></h3>
              <h3><span>Profit Withdraw</span> <span>Anytime</span></h3>
              <Link to="/signup">
                <button className="btns">
                  INVEST NOW <FaArrowRight className="icon" />
                </button>
              </Link>
            </div>
            <div className="grid-item" data-aos="fade-left">
              <div className="icon-container">
                <FaRocket size={60} color="#4CAF50" />
                <span className="box-number" style={{ borderRadius: '5px', padding: '0 5px', fontSize: '13px' }}>BEST SCHEMA</span>
              </div>
              <h1>ENHANCED</h1>
              <h3>daily 25%</h3>
              <h3><span>Investment</span><span style={{ background: '#ddd', borderRadius: '5px', padding: '0 5px' }}> $500-$2000</span></h3>
              <h3><span>Capital Back</span><span>yes</span></h3>
              <h3><span>Return Type</span><span> Lifetime</span></h3>
              <h3><span>Number of Period</span><span> Unlimited </span></h3>
              <h3><span>Profit Withdraw</span><span> Anytime</span></h3>
              <Link to="/signup">
                <button className="btns">
                  INVEST NOW <FaArrowRight className="icon" />
                </button>
              </Link>
            </div>
            <div className="grid-item" data-aos="fade-right">
              <div className="icon-container">
                <FaShieldAlt size={60} color="#4CAF50" />
                <span className="box-number">3</span>
              </div>
              <h1>GROWTH</h1>
              <h3>daily 45%</h3>
              <h3><span>Investment</span><span style={{ background: '#ddd', borderRadius: '5px', padding: '0 5px' }}> $2000-$5000</span></h3>
              <h3><span>Capital Back</span><span> Yes</span></h3>
              <h3><span>Return Type</span><span> Lifetime</span></h3>
              <h3><span>Number of Period</span><span> Unlimited </span></h3>
              <h3><span>Profit Withdraw</span><span> Anytime</span></h3>
              <Link to="/signup">
                <button className="btns">
                  INVEST NOW <FaArrowRight className="icon" />
                </button>
              </Link>
            </div>
            <div className="grid-item" data-aos="fade-left">
              <div className="icon-container">
                <FaPiggyBank size={60} color="#4CAF50" />
                <span className="box-number">4</span>
              </div>
              <h1>ELITE</h1>
              <h3>daily 65%</h3>
              <h3><span>Investment</span> <span style={{ background: '#ddd', borderRadius: '5px', padding: '0 5px' }}>$5000-$10000</span></h3>
              <h3><span>Capital Back</span> <span>Yes</span></h3>
              <h3><span>Return Type</span> <span>Lifetime</span></h3>
              <h3><span>Number of Period</span> <span>Unlimited </span></h3>
              <h3><span>Profit Withdraw</span> <span>Anytime</span></h3>
              <Link to="/signup">
                <button className="btns">
                  INVEST NOW <FaArrowRight className="icon" />
                </button>
              </Link>
            </div>
            <div className="grid-item last-item" data-aos="fade-up">
              <div className="icon-container">
                <FaBriefcase size={60} color="#4CAF50" />
                <span className="box-number">5</span>
              </div>
              <h1>WEEKEND PLAN</h1>
              <h3>daily 95%</h3>
              <h3><span>Investment</span> <span style={{ background: '#ddd', borderRadius: '5px', padding: '0 5px' }}>$10000-$1000000</span></h3>
              <h3><span>Capital Back</span> <span>Yes</span></h3>
              <h3><span>Return Type</span> <span>Lifetime</span></h3>
              <h3><span>Number of Period</span> <span>Unlimited </span></h3>
              <h3><span>Profit Withdraw</span> <span>Anytime</span></h3>
              <Link to="/signup">
                <button className="btns">
                  INVEST NOW <FaArrowRight className="icon" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Trading;