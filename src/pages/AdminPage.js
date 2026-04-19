// src/pages/AdminPage.js
import { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users'); 
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]); // ⬅️ NEW: State to hold contact messages
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // ⬅️ NEW: Fetch all three datasets at the exact same time
      const [usersRes, postsRes, messagesRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/posts'),
        API.get('/admin/messages') 
      ]);
      setUsers(usersRes.data);
      setPosts(postsRes.data);
      setMessages(messagesRes.data);
    } catch (err) {
      alert('Failed to load admin data. Are you sure you are logged in as admin?');
    } finally {
      setLoading(false);
    }
  };

  // ─── USER ACTIONS ───
  const toggleUserStatus = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}/status`);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  // ─── POST ACTIONS ───
  const deleteGlobalPost = async (postId) => {
    if (!window.confirm("ADMIN ACTION: Are you sure you want to permanently delete this user's post?")) return;
    try {
      await API.delete(`/admin/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId)); 
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  // ─── MESSAGE ACTIONS ───
  const deleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await API.delete(`/admin/messages/${messageId}`);
      setMessages(messages.filter(msg => msg._id !== messageId)); // Remove from screen
    } catch (err) {
      alert('Failed to delete message');
    }
  };

  if (loading) return <div className="container mt-2">Loading Admin Dashboard...</div>;

  return (
    <main className="container" style={{ marginTop: '2rem' }}>
      <h2>Admin Dashboard</h2>
      <p>Welcome to the control center. Please moderate responsibly.</p>

      {/* ─── DASHBOARD TABS ─── */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', borderBottom: '2px solid var(--muted)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('users')}
          style={{ background: activeTab === 'users' ? 'var(--accent)' : 'transparent', color: activeTab === 'users' ? 'white' : 'var(--accent)', border: '2px solid var(--accent)', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Manage Users ({users.length})
        </button>
        <button 
          onClick={() => setActiveTab('posts')}
          style={{ background: activeTab === 'posts' ? 'var(--accent)' : 'transparent', color: activeTab === 'posts' ? 'white' : 'var(--accent)', border: '2px solid var(--accent)', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Global Posts ({posts.length})
        </button>
        <button 
          onClick={() => setActiveTab('messages')} // ⬅️ NEW: Now this button actually opens the tab!
          style={{ background: activeTab === 'messages' ? 'var(--accent)' : 'transparent', color: activeTab === 'messages' ? 'white' : 'var(--accent)', border: '2px solid var(--accent)', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Contact Messages ({messages.length})
        </button>
      </div>

      {/* ─── TAB CONTENT: USERS ─── */}
      {activeTab === 'users' && (
        <div style={{ marginTop: '2rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', background: 'var(--bg)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--muted)' }}>
                <th style={{ padding: '15px' }}>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--muted)' }}>
                  <td style={{ padding: '15px' }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span style={{ background: u.role === 'admin' ? '#fef08a' : '#e0e7ef', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{u.role}</span></td>
                  <td style={{ color: u.status === 'active' ? '#166534' : '#991b1b', fontWeight: 'bold' }}>
                    {u.status.toUpperCase()}
                  </td>
                  <td>
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => toggleUserStatus(u._id)}
                        style={{ padding: '6px 12px', background: u.status === 'active' ? '#fee2e2' : '#dcfce3', color: u.status === 'active' ? '#991b1b' : '#166534', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Reactivate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── TAB CONTENT: GLOBAL POSTS ─── */}
      {activeTab === 'posts' && (
        <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem' }}>
          {posts.length === 0 ? <p>No posts exist on the platform yet.</p> : posts.map(post => (
            <div key={post._id} style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: 0, color: 'var(--accent)' }}>{post.title}</h4>
                <p style={{ margin: '5px 0', fontSize: '0.9rem', color: 'var(--muted)' }}>By: {post.author?.name} | {new Date(post.createdAt).toLocaleDateString()}</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{post.content.substring(0, 100)}...</p>
              </div>
              <button 
                onClick={() => deleteGlobalPost(post._id)}
                style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Delete Post
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ─── TAB CONTENT: CONTACT MESSAGES ─── */}
      {activeTab === 'messages' && (
        <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem' }}>
          {messages.length === 0 ? <p>Your inbox is empty.</p> : messages.map(msg => (
            <div key={msg._id} style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, color: 'var(--accent)' }}>{msg.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 'bold' }}>Email: <a href={`mailto:${msg.email}`}>{msg.email}</a></p>
                <div style={{ background: 'rgba(0,0,0,0.03)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                </div>
              </div>
              <button 
                onClick={() => deleteMessage(msg._id)}
                style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '1rem' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default AdminPage;