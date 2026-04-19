// src/pages/Contact.js
import { useState } from 'react';
import API from '../api/axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      await API.post('/contact', formData);
      setStatus('Message sent successfully! The admin will review it shortly.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      <div style={{ 
        maxWidth: '600px', 
        width: '100%', 
        background: 'var(--bg)', 
        padding: '3rem', 
        borderRadius: '12px', 
        border: '1px solid var(--muted)', 
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)', 
        textAlign: 'center' 
      }}>
        
        <h1 style={{ color: 'var(--text)', marginBottom: '1rem' }}>Contact Administration</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
          Have a question, business inquiry, or encountered a bug on the platform? 
          Fill out the form below to send a direct message to the system administrator. 
          We typically respond within 24-48 hours.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text)', fontWeight: 'bold' }}>Your Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--muted)', background: 'rgba(0,0,0,0.1)', color: 'var(--text)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text)', fontWeight: 'bold' }}>Your Email</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--muted)', background: 'rgba(0,0,0,0.1)', color: 'var(--text)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text)', fontWeight: 'bold' }}>Message</label>
            <textarea 
              required
              rows="5"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--muted)', background: 'rgba(0,0,0,0.1)', color: 'var(--text)', outline: 'none', resize: 'vertical' }}
            ></textarea>
          </div>

          <button type="submit" style={{ background: 'var(--accent)', color: '#000', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', marginTop: '10px' }}>
            Send Message
          </button>

          {status && <p style={{ textAlign: 'center', marginTop: '1rem', color: status.includes('successfully') ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{status}</p>}
        </form>

      </div>
    </div>
  );
};

export default Contact;