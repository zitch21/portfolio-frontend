// src/pages/HomePage.js
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import CommentSection from '../components/CommentSection';

// ─── REUSABLE SCROLL REVEAL COMPONENT ───
const FadeInSection = ({ children }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(domRef.current);
        }
      });
    });
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={domRef} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}>
      {children}
    </div>
  );
};

const HomePage = () => {
  // App State
  const [typedText, setTypedText] = useState('');
  const [posts, setPosts] = useState([]);
  const [expandedComments, setExpandedComments] = useState({}); // ⬅️ NEW: Tracks hidden/shown comments
  const { user } = useAuth();
  const fullText = "HI THERE! I'M A STUDENT WEB DEVELOPER.";

  // Typewriter Effect
  useEffect(() => {
    let index = 0;
    const typeTimer = setInterval(() => {
      setTypedText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(typeTimer);
    }, 100);
    return () => clearInterval(typeTimer);
  }, []);

  // Fetch Posts on Load
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get('/posts');
      setPosts(data);
    } catch (err) {
      console.error("Could not load posts.");
    }
  };

  // Handle Like Button Click
  const handleLike = async (postId) => {
    if (!user) {
      alert("Please log in or register to like posts!");
      return;
    }
    try {
      const { data } = await API.put(`/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: data } : post
      ));
    } catch (err) {
      console.error("Failed to like post");
    }
  };

  // ⬅️ NEW: Toggle Comments Function
  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <main>
      {/* ─── HERO SECTION ─── */}
      <section className="hero container">
        <div className="hero-left">
          <h1>{typedText}<span className="cursor">|</span></h1>
          <p>BS Computer Science student at DMMMSU. Learning to build clean and functional websites.</p>
          <p>I am currently focusing on mastering HTML5 structure and CSS styling. This portfolio serves as a documentation of my progress, displaying the projects I've built as I learn web development fundamentals.</p>
          <br />
          <Link to="/about"><button>Learn More About Me</button></Link>
          {!user && <Link to="/register"><button className="mr-1">Sign Up Now</button></Link>}
          {user && <Link to="/create-post"><button className="mr-1">Write a Post</button></Link>}
        </div>
        <div className="hero-right">
          <div className="profile-circle">
            <img src="/assets/me.webp" alt="Profile placeholder" />
          </div>
        </div>
      </section>

      <hr className="container divider" />

      {/* ─── PORTFOLIO HIGHLIGHTS ─── */}
      <FadeInSection>
        <section className="container">
          <h2>Portfolio Highlights</h2>
          <p className="center-text">Here is a quick overview of what you will find in this portfolio:</p>
          <ul>
            <li><strong>Interactive Contact Form:</strong> A fully functional contact page with client-side validation.</li>
            <li><strong>Modern Responsive Design:</strong> Clean layout using Google Fonts, CSS Grid, and mobile-friendly styles.</li>
            <li><strong>Location Map Embed:</strong> Google Maps integration to display my academic location.</li>
          </ul>
        </section>
      </FadeInSection>
      
      {/* ─── DYNAMIC POST FEED ─── */}
      <FadeInSection>
        <section className="container" style={{ marginTop: '4rem' }}>
          {/* Add this right before your posts render */}
          <SearchBar />
          <h2>Recent Updates & Projects</h2>
          
          {posts.length === 0 ? (
            <p className="center-text">No posts yet. Be the first to create one!</p>
          ) : (
            <div style={{ display: 'grid', gap: '2rem', marginTop: '1.5rem' }}>
              {posts.map(post => {
                const hasLiked = user && post.likes.includes(user._id);

                return (
                  <div key={post._id} style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--muted)' }}>
                    
                    {/* Post Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, color: 'var(--accent)' }}>{post.title}</h3>
                      <span style={{ fontSize: '0.8rem', background: '#e0e7ef', padding: '4px 8px', borderRadius: '12px', color: '#1e293b' }}>{post.category}</span>
                    </div>
                    
                    {/* Post Author & Date (⬅️ NEW: Link wrapped around author name) */}
                    <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
                      Posted by <Link to={`/profile/${post.author?._id}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>{post.author?.name || 'Unknown'}</Link> on {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    
                    {/* Post Content */}
                    <p style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{post.content}</p>

                    {/* Image Render (If one exists) */}
                    {post.coverImage && (
                      <img 
                        src={post.coverImage} 
                        alt="Post cover" 
                        loading="lazy" 
                        style={{ 
                          width: '100%', 
                          maxHeight: '500px', 
                          objectFit: 'contain', 
                          backgroundColor: 'rgba(0,0,0,0.2)', 
                          borderRadius: '8px', 
                          marginTop: '1rem' 
                        }} 
                      />
                    )}
                    
                    {/* Interactive Buttons (Like & Comment Toggle) */}
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      
                      <button 
                        onClick={() => handleLike(post._id)}
                        style={{
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: hasLiked ? '#ef4444' : 'var(--muted)'
                        }}
                      >
                        <span style={{ fontSize: '1.2rem' }}>{hasLiked ? '❤️' : '🤍'}</span> 
                        {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
                      </button>

                      {/* ⬅️ NEW: Toggle button to show/hide the CommentSection */}
                      <button 
                        onClick={() => toggleComments(post._id)}
                        style={{
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: 'var(--text)',
                          fontWeight: 'bold'
                        }}
                      >
                        💬 {expandedComments[post._id] ? 'Hide Comments' : 'Show Comments'}
                      </button>

                    </div>

                    {/* ⬅️ NEW: Conditionally rendering the Comment Section */}
                    {expandedComments[post._id] && (
                      <div style={{ marginTop: '1.5rem' }}>
                        <CommentSection postId={post._id} />
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </section>
      </FadeInSection>

    </main>
  );
};

export default HomePage;