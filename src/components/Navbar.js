// src/components/Navbar.js
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { themeMode, themeAccent, toggleThemeMode, setAccentColor } = useTheme();
  const [showAccentPicker, setShowAccentPicker] = useState(false);

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

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="site-header">
      <nav className="nav container">
        <div className="logo"><strong>EJPB</strong></div>
        <ul className="nav-right">
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
                transition: 'all 0.25s ease'
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--text-muted)')}
              title="Toggle light/dark mode"
            >
              {themeMode === 'dark' ? '☀️' : '🌙'}
            </button>
          </li>

          <li style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAccentPicker(!showAccentPicker)}
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
                transition: 'all 0.25s ease'
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--text-muted)')}
              title="Open accent picker"
            >
              🎨
            </button>
            {showAccentPicker && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--text-muted)',
                  borderRadius: '14px',
                  padding: '12px',
                  boxShadow: '0 16px 40px rgba(15, 23, 42, 0.16)',
                  zIndex: 1000,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '10px',
                  minWidth: '144px'
                }}
              >
                {accentColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setAccentColor(color);
                      setShowAccentPicker(false);
                    }}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: themeAccent === color ? '3px solid var(--text-main)' : '2px solid var(--text-muted)',
                      background: accentColorMap[color],
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: themeAccent === color ? '0 0 10px rgba(0, 0, 0, 0.2)' : 'none'
                    }}
                    aria-label={`Set ${color} accent`}
                  />
                ))}
              </div>
            )}
          </li>

          <li>
            <Link to="/home" className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}>
              HOME
            </Link>
          </li>
          <li>
            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
              ABOUT
            </Link>
          </li>

          {(!user || user.role !== 'admin') && (
            <li>
              <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
                CONTACT
              </Link>
            </li>
          )}

          {!user && (
            <>
              <li>
                <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
                  LOGIN
                </Link>
              </li>
              <li>
                <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>
                  REGISTER
                </Link>
              </li>
            </>
          )}

          {user && (
            <>
              <li>
                <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
                  PROFILE
                </Link>
              </li>
              <li>
                <Link to="/create-post" className={`nav-link ${location.pathname === '/create-post' ? 'active' : ''}`}>
                  WRITE
                </Link>
              </li>
            </>
          )}

          {user && user.role === 'admin' && (
            <li>
              <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                DASHBOARD
              </Link>
            </li>
          )}

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
                  transition: 'all 0.25s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'var(--color-accent)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--color-accent)';
                }}
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
