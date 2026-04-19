// src/pages/PublicProfile.js
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PublicProfile = () => {
  const { id } = useParams(); 
  const { user: currentUser } = useAuth(); 
  
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get(`/users/${id}`);
      setProfileData(data.user);
      setUserPosts(data.posts);
      
      if (currentUser && data.user.followers.includes(currentUser._id)) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) return alert("You must be logged in to follow users.");
    try {
      await API.put(`/users/${id}/follow`);
      setIsFollowing(!isFollowing);
      setProfileData(prev => ({
        ...prev,
        followers: isFollowing 
          ? prev.followers.filter(followerId => followerId !== currentUser._id) 
          : [...prev.followers, currentUser._id] 
      }));
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '50px', color: 'var(--accent)' }}>Loading profile...</div>;
  if (!profileData) return <div className="container" style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text)' }}>User not found.</div>;

  const isOwnProfile = currentUser && currentUser._id === profileData._id;
  const popularityScore = userPosts.reduce((total, post) => total + post.likes.length, 0);

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      
      {/* ─── PROFILE HEADER CARD ─── */}
      <div style={{ background: 'var(--bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--muted)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#000', overflow: 'hidden' }}>
          {profileData.profilePic ? (
             <img src={`http://localhost:5000/uploads/${profileData.profilePic}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
             profileData.name.charAt(0).toUpperCase()
          )}
        </div>
        
        <h1 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>{profileData.name}</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>{profileData.role === 'admin' ? '⭐ Admin' : 'Member'}</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem', color: 'var(--text)' }}>
          <div><strong>{profileData.followers.length}</strong> <span style={{ color: 'var(--muted)' }}>Followers</span></div>
          <div><strong>{profileData.following.length}</strong> <span style={{ color: 'var(--muted)' }}>Following</span></div>
          <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>⭐ {popularityScore} <span style={{ color: 'var(--muted)', fontWeight: 'normal' }}>Popularity</span></div>
        </div>

        {!isOwnProfile ? (
          <button 
            onClick={handleFollowToggle}
            style={{
              padding: '8px 24px',
              borderRadius: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              background: isFollowing ? 'transparent' : 'var(--accent)',
              color: isFollowing ? 'var(--text)' : '#000',
              border: isFollowing ? '2px solid var(--muted)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        ) : (
          <Link to="/profile">
            <button style={{ padding: '8px 24px', borderRadius: '20px', background: 'transparent', color: 'var(--accent)', border: '2px solid var(--accent)', cursor: 'pointer' }}>
              Edit My Profile
            </button>
          </Link>
        )}
      </div>

      {/* ─── USER'S POSTS ─── */}
      <h3 style={{ color: 'var(--text)', marginTop: '3rem', borderBottom: '1px solid var(--muted)', paddingBottom: '10px' }}>
        Posts by {profileData.name}
      </h3>

      <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
        {userPosts.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>This user hasn't posted anything yet.</p>
        ) : (
          userPosts.map(post => (
            <div key={post._id} style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '8px', borderLeft: '3px solid var(--accent)', border: '1px solid var(--muted)' }}>
              <h4 style={{ margin: '0 0 10px 0', color: 'var(--accent)' }}>{post.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '10px' }}>{new Date(post.createdAt).toLocaleDateString()}</p>
              <p style={{ color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{post.content}</p>
              
              {post.coverImage && (
                <img
                    src={`http://localhost:5000/uploads/${post.coverImage}`} 
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PublicProfile;