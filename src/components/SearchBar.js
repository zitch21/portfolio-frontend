// src/components/SearchBar.js
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data } = await API.get(`/users/search?q=${query}`);
        setResults(data);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
      <input 
        type="text" 
        placeholder="🔍 Search users by name..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 20px',
          borderRadius: '25px',
          border: '1px solid var(--muted)',
          background: 'var(--bg)',
          color: 'var(--text)',
          outline: 'none',
          fontSize: '1rem'
        }}
      />

      {/* ─── DROPDOWN RESULTS ─── */}
      {results.length > 0 && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0, 
          background: 'var(--bg)', 
          border: '1px solid var(--muted)',
          borderRadius: '8px', 
          marginTop: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          zIndex: 100, 
          overflow: 'hidden'
        }}>
          {results.map(user => (
            <Link 
              key={user._id} 
              to={`/profile/${user._id}`} 
              onClick={() => setQuery('')} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 20px',
                color: 'var(--text)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--muted)',
                transition: 'background 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--muted)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', overflow: 'hidden' }}>
                {user.profilePic ? (
                  <img src={`http://localhost:5000/uploads/${user.profilePic}`} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <span>{user.name}</span>
            </Link>
          ))}
        </div>
      )}
      
      {isSearching && <div style={{ position: 'absolute', right: '15px', top: '12px', color: 'var(--muted)', fontSize: '0.9rem' }}>Searching...</div>}
    </div>
  );
};

export default SearchBar;