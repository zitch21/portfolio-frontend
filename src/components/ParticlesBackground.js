// src/components/ParticlesBackground.js
import React from 'react';

const ParticlesBackground = () => {
  // Generate an array of 15 particles with random properties
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 40 + 10, // Random size between 10px and 50px
    left: Math.random() * 100,     // Random horizontal starting position (0% to 100%)
    duration: Math.random() * 20 + 10, // How fast it floats up (10s to 30s)
    delay: Math.random() * 5,      // Delay before it starts (0s to 5s)
  }));

  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
    </div>
  );
};

export default ParticlesBackground;