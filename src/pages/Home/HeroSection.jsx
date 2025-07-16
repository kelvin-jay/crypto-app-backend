import React, { useEffect, useState } from 'react';
import './HeroSection.css';
import people_trust_video from '../../assets/people_trust_video.png';
import play_spin_icon from '../../assets/play_spin_icon.png';
import star_focus from '../../assets/star_focus.png'; // Replace with your star image
import AOS from 'aos';
import 'aos/dist/aos.css';

const HeroSection = () => {
  const [showVideoInline, setShowVideoInline] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="heros-section">
      <div className="hero-top" data-aos="fade-up">
        <p className="trust-text" data-aos="fade-up" data-aos-delay="100">
          People Trust Us
        </p>
        <h1 className="hero-title" data-aos="fade-up" data-aos-delay="200">
          Millions of Users Worldwide
          <img src={star_focus} alt="star" className="rotating-star" />
        </h1>
        <p className="hero-description" data-aos="fade-up" data-aos-delay="300">
          The rise of cryptocurrencies has opened up new trading. This beginner's
          guide to cryptocurrency trading demystifies the world of digital currencies.
        </p>
        <div className="hero-buttons" data-aos="zoom-in" data-aos-delay="400">
          <button className="hero-btn filled">📝 Test Your Knowledge</button>
          <button
            className="hero-btn outlined"
            onClick={() => scrollToSection('tutorials')}
          >
            🎥 Tutorial Videos
          </button>
          <button
            className="hero-btn outlined"
            onClick={() => setIsModalOpen(true)}
          >
            📺 Live Commentary
          </button>
        </div>
      </div>

      <div className="hero-bottom">
        <div className="hero-left" data-aos="fade-right">
          <div className="video-container">
            {!showVideoInline ? (
              <>
                <img
                  src={people_trust_video}
                  alt="video"
                  className="video-image"
                />
                <div
                  className="play-button"
                  onClick={() => setShowVideoInline(true)}
                >
                  <img src={play_spin_icon} alt="play" className="spin-round" />
                </div>
              </>
            ) : (
              <div className="video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/s4g1XFU8Gto?autoplay=1"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>

        <div className="hero-right" data-aos="fade-left">
          <p className="info-text" data-aos="fade-left" data-aos-delay="100">
            The rise of cryptocurrencies has opened up new trading. In this beginner's
            guide to cryptocurrency trading, we demystify the world of digital currencies.
          </p>

          <div className="bullet-points" data-aos="fade-up" data-aos-delay="200">
            <ul>
              <li>✅ Charts trading</li>
              <li>✅ Worldly Power</li>
            </ul>
            <ul>
              <li>✅ Supreme Authority</li>
              <li>✅ Global Dominance</li>
            </ul>
          </div>

          <div className="stats" data-aos="fade-up" data-aos-delay="300">
            <div className="stat">
              <h2>12K</h2>
              <p>Users Joined</p>
            </div>
            <div className="stat">
              <h2>5.5M</h2>
              <p>Monthly Volume (In USD)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Video Popup */}
      {isModalOpen && (
        <div className="video-modal" onClick={() => setIsModalOpen(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <iframe
              src="https://www.youtube.com/embed/s4g1XFU8Gto?autoplay=1"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
