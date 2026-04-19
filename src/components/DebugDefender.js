import { useEffect, useRef, useState } from 'react';

const DebugDefender = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const scoreRef = useRef(null);
  
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameover'
  const [finalScore, setFinalScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([0]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let gameRunning = true;
    let score = 0;
    let frameCount = 0;

    // Adjust canvas size to parent container
    const resizeGame = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.offsetWidth;
        canvas.height = containerRef.current.offsetHeight;
      }
    };
    resizeGame();
    window.addEventListener('resize', resizeGame);

    // --- GAME CLASSES ---
    class Player {
      constructor(x, y) {
        this.x = x; this.y = y; this.radius = 12; this.color = '#38bdf8';
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = powerUpActive ? '#fbbf24' : this.color;
        ctx.fill();
        ctx.shadowBlur = 15;
        ctx.shadowColor = powerUpActive ? '#fbbf24' : this.color;
      }
      update(keys) {
        const speed = 5;
        if (keys['w'] && this.y - this.radius > 0) this.y -= speed;
        if (keys['s'] && this.y + this.radius < canvas.height) this.y += speed;
        if (keys['a'] && this.x - this.radius > 0) this.x -= speed;
        if (keys['d'] && this.x + this.radius < canvas.width) this.x += speed;
        this.draw();
        ctx.shadowBlur = 0;
      }
    }

    class Projectile {
      constructor(x, y, velocity) {
        this.x = x; this.y = y; this.radius = 4; this.color = '#fff'; this.velocity = velocity;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();
      }
    }

    class Enemy {
      constructor(x, y, radius, color, velocity) {
        this.x = x; this.y = y; this.radius = radius; this.color = color; this.velocity = velocity;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
      }
      update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();
      }
    }

    class Particle {
      constructor(x, y, color, velocity) {
        this.x = x; this.y = y; this.color = color; this.velocity = velocity;
        this.alpha = 1;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
      update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.03;
        this.draw();
      }
    }

    class PowerUpItem {
      constructor(x, y) {
        this.x = x; this.y = y; this.radius = 8; this.color = '#fbbf24';
        this.velocity = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      update() {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) this.velocity.x = -this.velocity.x;
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) this.velocity.y = -this.velocity.y;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();
      }
    }

    // --- GAME STATE ---
    let player = new Player(canvas.width / 2, canvas.height / 2);
    let projectiles = [];
    let enemies = [];
    let particles = [];
    let powerUps = [];
    let powerUpActive = false;
    let powerUpTimer = 0;
    const keys = {};

    // --- INPUT LISTENERS ---
    const handleKeyDown = (e) => keys[e.key.toLowerCase()] = true;
    const handleKeyUp = (e) => keys[e.key.toLowerCase()] = false;
    const handleMouseDown = (e) => {
      if (!gameRunning) return;
      const rect = canvas.getBoundingClientRect();
      const angle = Math.atan2(e.clientY - rect.top - player.y, e.clientX - rect.left - player.x);
      
      projectiles.push(new Projectile(player.x, player.y, { x: Math.cos(angle) * 8, y: Math.sin(angle) * 8 }));

      if (powerUpActive) {
        projectiles.push(new Projectile(player.x, player.y, { x: Math.cos(angle - 0.2) * 8, y: Math.sin(angle - 0.2) * 8 }));
        projectiles.push(new Projectile(player.x, player.y, { x: Math.cos(angle + 0.2) * 8, y: Math.sin(angle + 0.2) * 8 }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousedown', handleMouseDown);

    // --- MAIN LOOP ---
    const animate = () => {
      if (!gameRunning) return;
      animationId = requestAnimationFrame(animate);
      frameCount++;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      player.update(keys);

      // Powerups
      if (powerUpActive) {
        powerUpTimer--;
        if (powerUpTimer <= 0) powerUpActive = false;
        ctx.font = '14px Poppins';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`MULTI-SHOT: ${(powerUpTimer/60).toFixed(1)}s`, 10, 50);
      }

      if (frameCount % 300 === 0 && Math.random() < 0.3) {
        powerUps.push(new PowerUpItem(Math.random() * canvas.width, Math.random() * canvas.height));
      }

      powerUps.forEach((p, i) => {
        p.update();
        if (Math.hypot(player.x - p.x, player.y - p.y) - player.radius - p.radius < 1) {
          powerUpActive = true;
          powerUpTimer = 300;
          powerUps.splice(i, 1);
        }
      });

      // Spawn Enemies
      if (frameCount % 60 === 0) {
        const radius = Math.random() * (20 - 10) + 10;
        let x, y;
        if (Math.random() < 0.5) {
          x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
          y = Math.random() * canvas.height;
        } else {
          x = Math.random() * canvas.width;
          y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        const color = `hsl(${Math.random() * 50}, 100%, 50%)`;
        const angle = Math.atan2(player.y - y, player.x - x);
        enemies.push(new Enemy(x, y, radius, color, { x: Math.cos(angle), y: Math.sin(angle) }));
      }

      particles.forEach((p, i) => p.alpha <= 0 ? particles.splice(i, 1) : p.update());
      projectiles.forEach((p, i) => {
        p.update();
        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) projectiles.splice(i, 1);
      });

      // Enemy Collision
      enemies.forEach((enemy, index) => {
        enemy.update();
        // Player hit
        if (Math.hypot(player.x - enemy.x, player.y - enemy.y) - enemy.radius - player.radius < 1) {
          gameRunning = false;
          setFinalScore(score);
          setLeaderboard(prev => {
            const updated = [...prev, score].sort((a, b) => b - a).slice(0, 5);
            return updated;
          });
          setGameState('gameover');
        }

        // Bullet hit
        projectiles.forEach((p, pIndex) => {
          if (Math.hypot(p.x - enemy.x, p.y - enemy.y) - enemy.radius - p.radius < 1) {
            setTimeout(() => {
              enemies.splice(index, 1);
              projectiles.splice(pIndex, 1);
              score += 10;
              if (scoreRef.current) scoreRef.current.innerText = score;
              for(let i=0; i<5; i++) {
                 particles.push(new Particle(p.x, p.y, enemy.color, {x: (Math.random()-0.5)*3, y: (Math.random()-0.5)*3}));
              }
            }, 0);
          }
        });
      });
    };

    animate();

    // --- CLEANUP ---
    return () => {
      gameRunning = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeGame);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (canvas) canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, [gameState]);

  return (
    <div ref={containerRef} style={{ position: 'relative', height: '500px', width: '100%', background: '#0f172a', borderRadius: '12px', border: '2px solid #2563eb', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
      
      {/* UI Overlays */}
      {gameState !== 'playing' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.9)', zIndex: 10, textAlign: 'center', color: 'white' }}>
          <h2 style={{ color: '#38bdf8', margin: '0 0 10px 0', textShadow: '0 0 10px rgba(56,189,248,0.5)' }}>DEBUG DEFENDER</h2>
          
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#cbd5e1' }}>
            <span style={{color:'#fbbf24'}}>★</span> Pick up Yellow Orbs for Multi-Shot<br/>
            <span style={{color:'#ef4444'}}>⚠</span> Survive as long as you can!
          </p>

          <button onClick={() => { setGameState('playing'); if(scoreRef.current) scoreRef.current.innerText = '0'; }} style={{ fontSize: '1.2rem', padding: '0.8rem 2rem', marginBottom: '1rem', cursor: 'pointer', background: 'linear-gradient(90deg, #2563eb, #38bdf8)', border: 'none', color: 'white', borderRadius: '4px' }}>
            {gameState === 'start' ? 'Start Game' : 'Play Again'}
          </button>
          
          {gameState === 'gameover' && (
            <div>
              <p style={{ color: '#ef4444', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>GAME OVER - Score: {finalScore}</p>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '8px', border: '1px solid #334155', width: '250px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#fbbf24', borderBottom: '1px solid #475569', paddingBottom: '5px' }}>TOP 5 - Leaderboards</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left', fontFamily: 'monospace', fontSize: '1rem' }}>
                  {leaderboard.map((sc, i) => (
                    <li key={i} style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
                      <span>#{i + 1}</span> 
                      <span style={{color: i === 0 ? '#fbbf24' : 'white'}}>{sc} pts</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Score Board */}
      <div style={{ position: 'absolute', top: '15px', left: '20px', color: 'white', fontFamily: "'Poppins', sans-serif", fontWeight: 'bold', fontSize: '1.1rem', pointerEvents: 'none', zIndex: 5 }}>
        Score: <span ref={scoreRef}>0</span>
      </div>

      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
};

export default DebugDefender;