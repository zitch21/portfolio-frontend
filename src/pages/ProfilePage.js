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
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [bio, setBio] = useState('');
  const [bioLoading, setBioLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'saved'
  const [savedPosts, setSavedPosts] = useState([]);

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
        setBio(profileData.user?.bio || '');
      } catch (err) {
        console.error("Failed to fetch user stats:", err);
      }

      // ─── INDEPENDENT BLOCK 3: Fetch Saved Posts ───
      try {
        const { data: savedPostsData } = await API.get('/users/saved-posts');
        setSavedPosts(savedPostsData);
      } catch (err) {
        console.error("Failed to fetch saved posts:", err);
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
      if (err.response?.status === 429) {
        alert("You can only change your profile picture once a day.");
      } else {
        alert("Failed to upload photo. Check backend console.");
      }
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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return setPasswordError('Please complete all password fields.');
    }

    if (newPassword.length < 6) {
      return setPasswordError('New password must be at least 6 characters long.');
    }

    if (newPassword !== confirmNewPassword) {
      return setPasswordError('New passwords do not match.');
    }

    setPasswordLoading(true);
    try {
      const { data } = await API.put('/users/change-password', {
        currentPassword,
        newPassword
      });

      setPasswordSuccess(data.message || 'Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleBioUpdate = async (e) => {
    e.preventDefault();
    setBioLoading(true);
    try {
      const { data } = await API.put('/users/bio', { bio });
      alert(data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update bio');
    } finally {
      setBioLoading(false);
    }
  };

  if (!user) return null;

  // Calculate Popularity dynamically
  const popularityScore = myPosts.reduce((total, post) => total + post.likes.length, 0);

  return (
    <main className="container" style={{ marginTop: '2rem' }}>
      
      {/* ─── USER STATS HEADER ─── */}
      <div className="profile-header" style={{ background: 'var(--bg)', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem', border: '1px solid var(--muted)' }}>
        
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

      <div className="profile-security-card" style={{ background: 'var(--bg)', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--muted)', marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--text)' }}>Security</h3>
            <p style={{ margin: '0.5rem 0 1.25rem', color: 'var(--muted)' }}>Update your password securely.</p>
          </div>
        </div>

        {passwordError && (
          <div style={{ marginBottom: '1rem', color: '#b91c1c', background: 'rgba(248, 113, 113, 0.12)', padding: '0.85rem 1rem', borderRadius: '8px' }}>
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div style={{ marginBottom: '1rem', color: '#064e3b', background: 'rgba(22, 163, 74, 0.12)', padding: '0.85rem 1rem', borderRadius: '8px' }}>
            {passwordSuccess}
          </div>
        )}

        <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: '1rem' }}>
          <label style={{ display: 'grid', gap: '0.4rem', color: 'var(--text)' }}>
            Current Password
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '8px', border: '1px solid var(--muted)', background: 'var(--panel)', color: 'var(--text)' }}
            />
          </label>

          <label style={{ display: 'grid', gap: '0.4rem', color: 'var(--text)' }}>
            New Password
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '8px', border: '1px solid var(--muted)', background: 'var(--panel)', color: 'var(--text)' }}
            />
          </label>

          <label style={{ display: 'grid', gap: '0.4rem', color: 'var(--text)' }}>
            Confirm New Password
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '8px', border: '1px solid var(--muted)', background: 'var(--panel)', color: 'var(--text)' }}
            />
          </label>

          <button
            type="submit"
            disabled={passwordLoading}
            style={{
              alignSelf: 'flex-start',
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              padding: '0.95rem 1.25rem',
              borderRadius: '8px',
              cursor: passwordLoading ? 'wait' : 'pointer',
              fontWeight: '700'
            }}
          >
            {passwordLoading ? 'Saving...' : 'Change Password'}
          </button>
        </form>
      </div>

      <div className="profile-bio-card" style={{ background: 'var(--bg)', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--muted)', marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--text)' }}>About Me</h3>
            <p style={{ margin: '0.5rem 0 1.25rem', color: 'var(--muted)' }}>Tell others about yourself. Max 500 characters.</p>
          </div>
        </div>

        <form onSubmit={handleBioUpdate} style={{ display: 'grid', gap: '1rem' }}>
          <label style={{ display: 'grid', gap: '0.4rem', color: 'var(--text)' }}>
            Bio
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself..."
              maxLength={500}
              style={{ 
                width: '100%', 
                padding: '0.9rem 1rem', 
                borderRadius: '8px', 
                border: '1px solid var(--muted)', 
                background: 'var(--panel)', 
                color: 'var(--text)',
                resize: 'vertical',
                minHeight: '100px',
                fontFamily: 'inherit'
              }}
            />
            <small style={{ color: 'var(--muted)', textAlign: 'right' }}>{bio.length}/500</small>
          </label>

          <button
            type="submit"
            disabled={bioLoading}
            style={{
              alignSelf: 'flex-start',
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              padding: '0.95rem 1.25rem',
              borderRadius: '8px',
              cursor: bioLoading ? 'wait' : 'pointer',
              fontWeight: '700'
            }}
          >
            {bioLoading ? 'Saving...' : 'Update Bio'}
          </button>
        </form>
      </div>

      <hr className="divider" />

      {/* ─── TABS NAVIGATION ─── */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--muted)' }}>
          <button
            onClick={() => setActiveTab('posts')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'posts' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'posts' ? '#fff' : 'var(--text)',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            My Posts ({myPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'saved' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'saved' ? '#fff' : 'var(--text)',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            Saved Posts ({savedPosts.length})
          </button>
        </div>
      </div>

      {/* ─── TAB CONTENT ─── */}
      {activeTab === 'posts' ? (
        <>
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
        </>
      ) : (
        <>
          <h3 style={{ color: 'var(--text)' }}>Saved Posts</h3>
          
          {loading ? (
            <p style={{ color: 'var(--muted)' }}>Loading your saved posts...</p>
          ) : savedPosts.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>You haven't saved any posts yet. Browse posts and click the bookmark button to save them for later!</p>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {savedPosts.map(post => (
                <div key={post._id} style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--muted)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: 0, color: 'var(--accent)' }}>{post.title}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                        By {post.author?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
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
        </>
      )}
    </main>
  );
};

export default ProfilePage;