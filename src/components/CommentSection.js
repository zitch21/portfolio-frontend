// src/components/CommentSection.js
import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

// ─── HELPER FUNCTION FOR TIME AGO ───
const timeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const CommentSection = ({ postId, postAuthor }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const { user } = useAuth();

  // Fetch comments when the component loads
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await API.get(`/comments/${postId}`);
        setComments(data);
      } catch (err) {
        console.error("Failed to load comments");
      }
    };
    fetchComments();
  }, [postId]);

  // Handle adding a new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const { data } = await API.post(`/comments/${postId}`, { text });
      setComments([...comments, data]); // Instantly add the new comment to the list
      setText(''); // Clear the input box
    } catch (err) {
      alert("Failed to post comment. Make sure you are logged in!");
    }
  };

  return (
    <div style={{ marginTop: '1.5rem', background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '8px' }}>
      <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--muted)' }}>
        Comments ({comments.length})
      </h4>

      {/* The List of Comments */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
        {comments.map(comment => (
          <div key={comment._id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            
            {/* Commenter's Profile Picture */}
            <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, overflow: 'hidden' }}>
              {comment.author?.profilePic ? (
                <img src={comment.author.profilePic} alt="pic" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                comment.author?.name?.charAt(0) || 'U'
              )}
            </div>

            {/* Comment Content */}
            <div style={{ background: 'var(--bg)', padding: '0.8rem 1rem', borderRadius: '0 12px 12px 12px', border: '1px solid var(--muted)', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>{comment.author?.name}</strong>
                  {comment.author?._id === postAuthor && (
                    <span style={{ backgroundColor: '#fbbf24', color: '#000', fontSize: '0.7rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '12px', marginLeft: '8px' }}>Author</span>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{timeAgo(comment.createdAt)}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Comment Form (Only visible to logged-in users) */}
      {user ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            placeholder="Write a comment..." 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid var(--muted)', outline: 'none' }}
          />
          <button type="submit" style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
            Post
          </button>
        </form>
      ) : (
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'center', margin: 0 }}>
          Please log in to leave a comment.
        </p>
      )}
    </div>
  );
};

export default CommentSection;