// src/pages/ProfilePage.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const ProfilePage = () => {
  const { user, setUser } = useAuth(); 
  const [myPosts, setMyPosts] = useState([]);
  const [stats, setStats] = useState({ followers: 0, following: 0 }); // Fresh stats state
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      setLoading(true);

      // ─── INDEPENDENT BLOCK 1: Fetch Posts Safely ───
      try {
        const { data: postsData } = await API.get('/posts');
        // The `?.` prevents fatal crashes if an author account was deleted from the database
        const filteredPosts = postsData.filter(post => post.author?._id === user._id);
        setMyPosts(filteredPosts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }

      // ─── INDEPENDENT BLOCK 2: Fetch Stats Safely ───
      // Because this is separated, a post error will NEVER stop your followers from loading!
      try {
        const { data: profileData } = await API.get(`/users/${user._id}`);
        setStats({
          followers: profileData.user?.followers?.length || 0,
          following: profileData.user?.following?.length || 0
        });
      } catch (err) {
        console.error("Failed to fetch user stats:", err);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, [user]);

  // Handle Profile Picture Upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file); 

    try {
      const { data } = await API.put('/users/profile-pic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Instantly updates UI and browser memory
      const updatedUser = { ...user, profilePic: data.profilePic };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert("Profile picture updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload photo. Check backend console.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await API.delete(`/posts/${postId}`);
      setMyPosts(myPosts.filter(post => post._id !== postId));
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  if (!user) return null;

  // Calculate Popularity dynamically
  const popularityScore = myPosts.reduce((total, post) => total + post.likes.length, 0);

  return (
    <main className="container" style={{ marginTop: '2rem' }}>
      
      {/* ─── USER STATS HEADER ─── */}
      <div style={{ background: 'var(--bg)', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem', border: '1px solid var(--muted)' }}>
        
        {/* Profile Picture Area */}
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          {user.profilePic ? (
            <img src={user.profilePic} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent)' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          <label style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--bg)', border: '2px solid var(--muted)', borderRadius: '50%', padding: '6px', cursor: uploading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✏️
            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handlePhotoUpload} disabled={uploading} />
          </label>
        </div>

        {/* User Info & Stats Grid */}
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, color: 'var(--text)' }}>{user.name}</h2>
          <p style={{ color: 'var(--muted)', margin: '5px 0' }}>{user.email}</p>
          
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>{myPosts.length}</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Posts</div>
            </div>
            
            {/* ⬅️ ADDED: The missing Star Icon for your own popularity! */}
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: '1.2rem', color: '#fbbf24' }}>⭐ {popularityScore}</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Popularity</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>{stats.followers}</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Followers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>{stats.following}</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Following</div>
            </div>

          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* ─── MY POSTS FEED ─── */}
      <h3 style={{ color: 'var(--text)' }}>My Published Posts</h3>
      
      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading your content...</p>
      ) : myPosts.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>You haven't written any posts yet. Head over to the Write tab to get started!</p>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {myPosts.map(post => (
            <div key={post._id} style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--accent)' }}>{post.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                
                <button 
                  onClick={() => handleDelete(post._id)}
                  style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Delete
                </button>
              </div>
              <p style={{ marginTop: '1rem', color: 'var(--text)' }}>{post.content}</p>

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
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default ProfilePage;