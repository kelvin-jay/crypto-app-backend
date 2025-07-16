import React, { useEffect, useState } from "react";
import "./CryptoAsset.css";
import AOS from "aos";
import "aos/dist/aos.css";

const statsData = [
  { label: "Active Users", value: 120000 },
  { label: "Assets Tracked", value: 350 },
  { label: "Countries", value: 80 }
];

const AnimatedStat = ({ value, label, aos, aosDelay }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    let incrementTime = 12;
    let step = Math.ceil(end / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);
  return (
    <div className="stat" data-aos={aos} data-aos-delay={aosDelay}>
      <div className="stat-value">{count.toLocaleString()}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

const CryptoAsset = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <section className="main-container-4">
      <div className="content-grade">
        <div className="icon-row">
          <span className="crypto-icon" data-aos="zoom-in" data-aos-delay="0">
            {/* Bitcoin */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="18" fill="#f7931a"/>
              <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold" dy=".3em">₿</text>
            </svg>
          </span>
          <span className="crypto-icon" data-aos="zoom-in" data-aos-delay="100">
            {/* Ethereum */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="18" fill="#627eea"/>
              <polygon points="18,8 26,18 18,22 10,18" fill="#fff"/>
              <polygon points="18,24 26,20 18,28 10,20" fill="#fff" opacity="0.7"/>
            </svg>
          </span>
          <span className="crypto-icon" data-aos="zoom-in" data-aos-delay="200">
            {/* USDT */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="18" fill="#26a17b"/>
              <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold" dy=".3em">T</text>
            </svg>
          </span>
        </div>
        <div className="stats-row">
          {statsData.map((stat, idx) => (
            <AnimatedStat
              key={idx}
              value={stat.value}
              label={stat.label}
              aos="fade-up"
              aosDelay={100 * idx}
            />
          ))}
        </div>
        <div className="text-grade">
          <h2 data-aos="fade-down" data-aos-delay="0">
            Grow Your Crypto Portfolio<br />with Confidence
          </h2>
          <p data-aos="fade-up" data-aos-delay="100">
            Discover, track, and manage your favorite digital assets in one secure place.
            Our platform provides real-time data, advanced analytics, and a seamless experience for both beginners and pros.
          </p>
          <button data-aos="zoom-in" data-aos-delay="200">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default CryptoAsset;