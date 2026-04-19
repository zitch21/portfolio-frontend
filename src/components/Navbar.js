// src/components/Navbar.js
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // ⬅️ NEW: Import useTheme

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { themeMode, themeAccent, toggleThemeMode, setAccentColor } = useTheme(); // ⬅️ NEW: Use theme context
  const [showAccentPicker, setShowAccentPicker] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      logout();
      navigate('/login'); 
    }
  };

  const accentColors = ['red', 'green', 'blue', 'purple', 'yellow', 'orange', 'monochrome'];
  const accentColorMap = {
    red: '#dc2626',
    green: '#16a34a',
    blue: '#2563eb',
    purple: '#9333ea',
    yellow: '#eab308',
    orange: '#ea580c',
    monochrome: themeMode === 'dark' ? '#ffffff' : '#000000'
  };

  return (
    <header className="site-header">
      <nav className="nav container">
        <div className="logo"><strong>EJPB</strong></div>
        <ul className="nav-right">
          
          {/* ─── LIGHT/DARK MODE TOGGLE ─── */}
          <li>
            <button 
              onClick={toggleThemeMode} 
              style={{ 
                background: 'var(--bg-secondary)', 
                border: '1px solid var(--text-muted)', 
                color: 'var(--text-main)', 
                cursor: 'pointer', 
                fontSize: '0.9rem', 
                padding: '6px 14px', 
                borderRadius: '20px', 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--text-muted)'}
              title="Toggle light/dark mode"
            >
              {themeMode === 'dark' ? '☀️' : '🌙'}
            </button>
          </li>

          {/* ─── ACCENT COLOR PICKER ─── */}
          <li style={{ position: 'relative' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {accentColors.map(color => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: themeAccent === color ? '3px solid var(--text-main)' : '2px solid var(--text-muted)',
                    background: accentColorMap[color],
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: themeAccent === color ? '0 0 8px rgba(0,0,0,0.3)' : 'none'
                  }}
                  onMouseOver={(e) => {
                    if (themeAccent !== color) {
                      e.currentTarget.style.transform = 'scale(1.15)';
                      e.currentTarget.style.boxShadow = '0 0 12px rgba(0,0,0,0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    if (themeAccent !== color) {
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                  title={`Set ${color} accent`}
                />
              ))}
            </div>
          </li>
          
          {/* Always visible links */}
          <li><Link to="/home" className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}>HOME</Link></li>
          <li><Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>ABOUT</Link></li>
          
          {/* Show Contact ONLY if user is NOT logged in, OR if logged in user is NOT an admin */}
          {(!user || user.role !== 'admin') && (
            <li><Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>CONTACT</Link></li>
          )}
          
          {/* Show these ONLY if NO ONE is logged in */}
          {!user && (
            <>
              <li><Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>LOGIN</Link></li>
              <li><Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>REGISTER</Link></li>
            </>
          )}

          {/* Show these ONLY if a user IS logged in */}
          {user && (
            <>
              <li><Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>PROFILE</Link></li>
              <li><Link to="/create-post" className={`nav-link ${location.pathname === '/create-post' ? 'active' : ''}`}>WRITE</Link></li>
            </>
          )}

          {/* Show this ONLY if the logged-in user is an ADMIN */}
          {user && user.role === 'admin' && (
            <li><Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>DASHBOARD</Link></li>
          )}

          {/* Show Logout Button ONLY if a user IS logged in */}
          {user && (
            <li>
              <button 
                onClick={handleLogout} 
                style={{ 
                  background: 'transparent', 
                  color: 'var(--color-accent)', 
                  border: '2px solid var(--color-accent)', 
                  padding: '5px 15px', 
                  borderRadius: '20px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => { e.target.style.background = 'var(--color-accent)'; e.target.style.color = 'white'; }}
                onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--color-accent)'; }}
              >
                LOGOUT
              </button>
            </li>
          )}
          
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;