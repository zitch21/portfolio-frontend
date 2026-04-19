// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  // If the app is still checking localStorage for a token, show nothing (or a spinner)
  if (loading) return <div className="container center-text mt-2">Loading...</div>;

  // If no user is logged in, send them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the route requires an admin, but the user is just a member, send them to home
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  // If they pass the checks, let them see the page!
  return children;
};

export default ProtectedRoute;