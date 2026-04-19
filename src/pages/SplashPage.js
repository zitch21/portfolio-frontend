import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashPage = () => {
  const [text, setText] = useState('');
  const [dots, setDots] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const navigate = useNavigate();
  const fullText = 'Welcome to my digital Portfolio';

  // 1. Typewriter Effect
  useEffect(() => {
    let index = 0;
    const typeTimer = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(typeTimer);
    }, 60);

    return () => clearInterval(typeTimer);
  }, []);

  // 2. Bouncing Dots Effect
  useEffect(() => {
    let count = 0;
    const dotTimer = setInterval(() => {
      count = (count + 1) % 4;
      setDots('.'.repeat(count));
    }, 500);

    return () => clearInterval(dotTimer);
  }, []);

  // 3. Fade Out and Redirect Timer
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500); // Start fade out at 2.5 seconds

    const redirectTimer = setTimeout(() => {
      navigate('/home'); // Redirect at 3 seconds
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="splash-wrapper">
      <div className="accent-bg" aria-hidden="true"></div>
      <div className={`loader-container ${isFadingOut ? 'fade-out' : 'fade-in'}`} role="status" aria-live="polite">
        <div className="splash-logo">
          <img src="/assets/me.webp" alt="Profile" />
        </div>
        <h1><span>{text}</span></h1>
        <div className="spinner"></div>
        <div className="loading-text">
          Loading<span className="dots">{dots}</span>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;