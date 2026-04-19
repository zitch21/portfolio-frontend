// src/api/axios.js
import axios from 'axios';

export default axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`
});

// ─── THE MAGIC INTERCEPTOR ───
// This attaches your JWT token to every request automatically
API.interceptors.request.use((req) => {
  const storedUser = localStorage.getItem('user');
  
  if (storedUser) {
    const user = JSON.parse(storedUser);
    // If a token exists, attach it to the Authorization header
    if (user.token) {
      req.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  
  return req;
});

export default API;