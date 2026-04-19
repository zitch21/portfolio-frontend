// src/pages/CreatePost.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Project');
  const [file, setFile] = useState(null);
  const [isPolishing, setIsPolishing] = useState(false); // ⬅️ NEW: Tracks AI loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  // ─── THE GEMINI AI FUNCTION ───
  const handlePolish = async () => {
    if (!content.trim()) return alert("Write something in the content box first!");
    
    setIsPolishing(true);
    try {
      const { data } = await API.post('/ai/polish', { text: content });
      setContent(data.polishedText); // Replaces their messy text with the AI text
    } catch (err) {
      console.error(err);
      alert("AI Polish failed. Ensure your API key is correct.");
    } finally {
      setIsPolishing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    if (file) formData.append('coverImage', file);

    try {
      await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/home'); 
    } catch (err) {
      console.error("Failed to create post", err);
      alert("Failed to create post. Check console.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '3rem auto' }}>
      <div style={{ background: 'var(--bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--muted)', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
        
        <h1 style={{ color: 'var(--text)', marginBottom: '2rem', borderBottom: '2px solid var(--accent)', paddingBottom: '10px' }}>
          Create a New Post
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontWeight: 'bold' }}>Post Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Built my first React App today!"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--muted)', background: 'rgba(0,0,0,0.1)', color: 'var(--text)', outline: 'none', fontSize: '1rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontWeight: 'bold' }}>Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--muted)', background: 'var(--bg)', color: 'var(--text)', outline: 'none', fontSize: '1rem' }}
              >
                <option value="Project">Project</option>
                <option value="Learning">Learning</option>
                <option value="Update">Update</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontWeight: 'bold' }}>Cover Image (Optional)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--muted)', background: 'rgba(0,0,0,0.1)', color: 'var(--text)', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
              <label style={{ color: 'var(--text)', fontWeight: 'bold' }}>Post Content</label>
              
              {/* ─── THE MAGIC POLISH BUTTON ─── */}
              <button 
                type="button" 
                onClick={handlePolish}
                disabled={isPolishing}
                style={{ 
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', 
                  color: '#000', 
                  border: 'none', 
                  padding: '6px 16px', 
                  borderRadius: '20px', 
                  fontWeight: 'bold',
                  cursor: isPolishing ? 'wait' : 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 10px rgba(245, 158, 11, 0.3)'
                }}
              >
                {isPolishing ? '✨ Polishing... Please wait (this may take a few seconds).' : '✨ Magic Polish'}
              </button>
            </div>

            <textarea 
              required
              rows="10"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your messy thoughts here, then click Magic Polish..."
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--muted)', background: 'rgba(0,0,0,0.1)', color: 'var(--text)', outline: 'none', resize: 'vertical', fontSize: '1rem', lineHeight: '1.5' }}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ background: 'var(--accent)', color: '#000', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: isSubmitting ? 'wait' : 'pointer', fontSize: '1.1rem', marginTop: '10px' }}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreatePost;