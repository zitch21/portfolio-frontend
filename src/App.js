// src/App.js
import PublicProfile from './pages/PublicProfile';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ParticlesBackground from './components/ParticlesBackground';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Protected Pages
import CreatePostPage from './pages/CreatePostPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';

// Layout wrapper to conditionally show Nav/Footer and always show Particles
const Layout = ({ children }) => {
  const location = useLocation();
  const isSplash = location.pathname === '/';

  return (
    <>
      <ParticlesBackground />
      {!isSplash && <Navbar />}
      {children}
      {!isSplash && (
        <footer className="site-footer">
          <div className="container">
            <p>&copy; 2026 EJPB. All Rights Reserved.</p>
            <p>Tubao, Ilocos Region, Philippines | contact@example.com</p>
          </div>
        </footer>
      )}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SplashPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile/:id" element={<PublicProfile />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes (Must be logged in) */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-post" 
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            } 
          />

          {/* Admin-Only Route */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;