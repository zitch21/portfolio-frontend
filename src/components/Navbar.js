// src/components/Navbar.js
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 
  const [isDark, setIsDark] = useState(localStorage.getItem('darkMode') === 'enabled');

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', null);
    }
  }, [isDark]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
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
          
          {/* ─── UPGRADED THEME TOGGLE BUTTON ─── */}
          <li>
            <button 
              onClick={() => setIsDark(!isDark)} 
              style={{ 
                background: 'var(--bg)', 
                border: '1px solid var(--muted)', 
                color: 'var(--text)', 
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
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--muted)'}
            >
              {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
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
                  color: 'var(--accent)', 
                  border: '2px solid var(--accent)', 
                  padding: '5px 15px', 
                  borderRadius: '20px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => { e.target.style.background = 'var(--accent)'; e.target.style.color = 'white'; }}
                onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--accent)'; }}
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