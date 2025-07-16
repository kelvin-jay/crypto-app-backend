import React, { useState, useEffect, useRef } from 'react';
import './EarnPopUp.css';

const users = [
  { name: 'Mia', location: 'Luxemburg', earnings: 2000 },
  { name: 'John', location: 'New York', earnings: 1500 },
  { name: 'Emily', location: 'London', earnings: 3000 },
  { name: 'Marvis', location: 'London', earnings: 5000 },
  { name: 'David', location: 'Paris', earnings: 2500 },
  { name: 'Bryan', location: 'Paris', earnings: 2500 },
  // Add more users here...
];

function EarnPopUp() {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    if (paused) return;

    intervalRef.current = setInterval(() => {
      setAnimateOut(true);
      setTimeout(() => {
        setAnimateOut(false);
        if (currentUserIndex === users.length - 1) {
          setShowPopup(false);
          setPaused(true);
          setTimeout(() => {
            setCurrentUserIndex(0);
            setShowPopup(true);
            setPaused(false);
          }, 30 * 60 * 1000); // 30 minutes
        } else {
          setCurrentUserIndex((prev) => prev + 1);
        }
      }, 800); // Animation out duration
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [currentUserIndex, paused]);

  const currentUser = users[currentUserIndex];

  return (
    <>
      {showPopup && currentUser && (
        <div className={`earn-popup-modern ${animateOut ? 'animate-out' : 'animate-in'}`}>
          <div className="earn-popup-avatar">
            <span role="img" aria-label="user">💸</span>
          </div>
          <div className="earn-popup-content">
            <div className="earn-popup-title">Recent Earnings</div>
            <div className="earn-popup-message">
              <b>{currentUser.name}</b> from <b>{currentUser.location}</b> just earned <span className="earn-popup-amount">${currentUser.earnings.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EarnPopUp;