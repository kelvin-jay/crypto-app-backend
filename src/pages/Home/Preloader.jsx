import React, { useRef, useState, useEffect } from 'react';
import './Preloader.css';

function Preloader() {
  const [circlePos, setCirclePos] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [mouse, setMouse] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [dotPull, setDotPull] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const requestRef = useRef();

  // Animate the circle to follow the mouse/touch
  useEffect(() => {
    const animate = () => {
      const dx = mouse.x - circlePos.x;
      const dy = mouse.y - circlePos.y;
      const spring = 0.18;
      const newCircle = {
        x: circlePos.x + dx * spring,
        y: circlePos.y + dy * spring,
      };
      setCirclePos(newCircle);

      // Dot pull: unlimited distance in direction of mouse/touch
      let pull = { x: 0, y: 0 };
      if (dx !== 0 || dy !== 0) {
        pull = { x: dx, y: dy };
      }
      setDotPull(pull);

      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line
  }, [mouse.x, mouse.y, circlePos.x, circlePos.y]);

  // Mouse and touch events
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
      setHovering(true);
      setCirclePos({
        x: e.clientX,
        y: e.clientY,
      });
      setDotPull({ x: 0, y: 0 });
    };
    const handleMouseLeave = () => {
      setHovering(false);
      setMouse({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    };

    // Touch support
   const handleTouchMove = (e) => {
  if (e.touches && e.touches.length > 0) {
    const touch = e.touches[0];
    setMouse({ x: touch.clientX, y: touch.clientY });
    setHovering(true);
    // Do NOT setCirclePos or setDotPull here!
  }
};
    const handleTouchEnd = () => {
      setHovering(false);
      setMouse({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <div
        className="preloader"
        style={{
          position: 'absolute',
          left: circlePos.x,
          top: circlePos.y,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div className="circle">
          <div
            className="dot"
            style={{
              transform: `translate(-50%, -50%) translate(${dotPull.x}px, ${dotPull.y}px)`,
              transition: hovering ? 'none' : 'transform 0.3s cubic-bezier(.68,-0.55,.27,1.55)',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Preloader;