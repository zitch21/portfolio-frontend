// src/pages/RegisterPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios'; // This allows us to talk to the backend!

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validation = {};
    if (!formData.name.trim()) validation.name = 'Name is required!';
    if (!formData.email.trim()) validation.email = 'Email is required!';
    if (!formData.password) validation.password = 'Password is required!';
    if (!formData.confirmPassword) validation.confirmPassword = 'Confirm password is required!';
    if (formData.password && formData.password.length < 6) validation.password = 'Password must be at least 6 characters.';
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) validation.confirmPassword = 'Passwords do not match!';

    if (Object.keys(validation).length) {
      setFieldErrors(validation);
      return;
    }

    setFieldErrors({});

    try {
      // 2. Send the data to your Express backend!
      await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      // 3. Show success and redirect to Login
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Waits 2 seconds so they can read the success message

    } catch (err) {
      // If the backend rejects it (e.g., email already taken), show the error
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  return (
    <main className="container">
      <div className="grid-2 align-start" style={{ marginTop: '2rem' }}>
        <div>
          <h2>Join the Community</h2>
          <p>Register to create your own profile, publish posts, and interact with others.</p>
          <img src="/assets/coding.webp" alt="Decorative technology" className="img-cover mt-2" style={{ borderRadius: '8px' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ background: 'var(--bg)', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>Sign Up</h3>
          
          {error && <div className="error" style={{ marginBottom: '1rem', padding: '0.5rem', background: '#fee2e2', borderRadius: '4px' }}>{error}</div>}
          
          {showSuccess && (
            <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#dcfce3', color: '#166534', borderRadius: '4px' }}>
              Account created successfully! Redirecting to login...
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} />
            {fieldErrors.name && <p style={{ color: '#dc2626', marginTop: '0.5rem', fontSize: '0.9rem' }}>{fieldErrors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} />
            {fieldErrors.email && <p style={{ color: '#dc2626', marginTop: '0.5rem', fontSize: '0.9rem' }}>{fieldErrors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} />
            {fieldErrors.password && <p style={{ color: '#dc2626', marginTop: '0.5rem', fontSize: '0.9rem' }}>{fieldErrors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            {fieldErrors.confirmPassword && <p style={{ color: '#dc2626', marginTop: '0.5rem', fontSize: '0.9rem' }}>{fieldErrors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }} disabled={showSuccess}>
            Create Account
          </button>
          
          <p className="center-text mt-2" style={{ fontSize: '0.9rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Log in here</Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;