import React, { useRef, useEffect, useState } from 'react';
import './Testimonies.css';
import photo1 from '../../assets/photo1.jpg';
import photo from '../../assets/photo.jpg';
import photo2 from '../../assets/photo2.jpg';
import photo5 from '../../assets/photo5.jpg';
import photo3 from '../../assets/photo3.jpg';
import photo6 from '../../assets/photo6.jpg';
import photo4 from '../../assets/photo4.jpg';
import photo7 from '../../assets/photo7.jpg';
import photo8 from '../../assets/photo8.jpg';
import photo9 from '../../assets/photo9.jpg';
import star from '../../assets/star.png';

const testimonies = [
  {
    img: photo9,
    name: "Balogh Imre",
    role: "Investor",
    text: "Trading has always been a passion, but it wasn't until I learned proper management that I began to see consistent profits"
  },
  {
    img: photo1,
    name: "John Doe",
    role: "Investor",
    text: "I've been investing in Bitcoin for years and it's been a game-changer for me. The returns are incredible!"
  },
  {
    img: photo,
    name: "Jane Smith",
    role: "Trader",
    text: "I was skeptical at first, but Bitcoin has exceeded my expectations. The community is amazing too!"
  },
  {
    img: photo4,
    name: "Bob Johnson",
    role: "Investor",
    text: "I've made some great returns with Bitcoin and I'm excited to see what the future holds. Highly recommend!"
  },
  {
    img: photo2,
    name: "Maria Rodriguez",
    role: "Investor",
    text: "Bitcoin has been a great addition to my investment portfolio. The potential for growth is huge!"
  },
  {
    img: photo3,
    name: "Susan Coman",
    role: "Trader",
    text: "I've been using Bitcoin for years and it's been a wild ride. But I wouldn't trade it for the world!"
  },
  {
    img: photo5,
    name: "Bryan Chen",
    role: "Investor",
    text: "Bitcoin has opened up a whole new world of investment opportunities for me. I'm so glad I got in early!"
  },
  {
    img: photo6,
    name: "Michael Brown",
    role: "Investor",
    text: "I was hesitant to invest in Bitcoin at first, but now I'm hooked. The returns are amazing!"
  },
  {
    img: photo7,
    name: "Sarah Taylor",
    role: "Business Owner",
    text: "Bitcoin has been a game-changer for my business. I can now accept payments from all over the world!"
  },
  {
    img: photo8,
    name: "Kevin White",
    role: "Investor",
    text: "I've made some great connections in the Bitcoin community. It's amazing to see how supportive everyone is!"
  }
];

const Testimonies = () => {
  const scrollRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const cardWidth = 380; // px, must match CSS

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      idx = (idx + 1) % testimonies.length;
      setActiveIdx(idx);
      scrollRef.current.scrollTo({
        left: idx * cardWidth,
        behavior: 'smooth'
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="testimonies-section">
      <div className="header">
        <h2>What our users say about <br /> Crypto Asset Tradetop</h2>
        <h3>Real people, real stories</h3>
      </div>
      <div className="animation-container">
        <img src={star} alt="Animation" className="animation" />
      </div>
      <div className="testimonies-scroll" ref={scrollRef}>
        {testimonies.map((t, idx) => (
          <div
            className={`testimony-card big${idx === activeIdx ? ' active' : ''}`}
            key={idx}
          >
            <div className="image-container">
              <img src={t.img} alt={t.name} />
            </div>
            <div className="testimony-content">
              <p>{t.text}</p>
              <span>{t.name}, {t.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Testimonies;