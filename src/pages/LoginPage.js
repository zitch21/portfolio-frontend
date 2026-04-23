// src/pages/LoginPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validation = {};

    if (!email.trim()) validation.email = 'Email is required!';
    if (!password) validation.password = 'Password is required!';

    if (Object.keys(validation).length) {
      setFieldErrors(validation);
      return;
    }

    setFieldErrors({});
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in. Please try again.');
    }
  };

  return (
    <main className="container">
      <div className="grid-2 align-start" style={{ marginTop: '2rem' }}>
        <div>
          <h2>Welcome Back</h2>
          <p>Sign in to access your dashboard, create posts, and interact with the community.</p>
          <img src="/assets/coveranimated.gif" alt="Coverlogoimage gif" className="img-cover mt-2" style={{ borderRadius: '8px' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ background: 'var(--bg)', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>Login</h3>
          
          {error && <div className="error" style={{ marginBottom: '1rem', padding: '0.5rem', background: '#fee2e2', borderRadius: '4px' }}>{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors(prev => ({ ...prev, email: '' }));
              }} 
            />
            {fieldErrors.email && <p style={{ color: '#dc2626', marginTop: '0.5rem', fontSize: '0.9rem' }}>{fieldErrors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors(prev => ({ ...prev, password: '' }));
              }} 
            />
            {fieldErrors.password && <p style={{ color: '#dc2626', marginTop: '0.5rem', fontSize: '0.9rem' }}>{fieldErrors.password}</p>}
          </div>

          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>Log In</button>
          
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Forgot your password?</Link>
          </div>
          
          <p className="center-text mt-2" style={{ fontSize: '0.9rem' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--accent)' }}>Register here</Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;