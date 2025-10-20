// src/App.js (Updated to include Wellness Hub route)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ObservationForm from './components/ObservationForm';
import Reports from './components/Reports';
import Profile from './components/Profile';
import Community from './components/Community';
import WellnessHub from './components/WellnessHub'; // New import
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

const AppContent = () => {
  const location = useLocation();
  const showNavbar = !['/login', '/register'].includes(location.pathname);
  const userId = localStorage.getItem('userId');

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    return userId ? children : <Navigate to="/login" replace state={{ from: location }} />;
  };

  return (
    <div>
      {showNavbar && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <div className="welcome-container">
              <h1 className="welcome-title">Welcome to Ayurveda Health Assessment</h1>
              <p className="welcome-description">Discover your unique health profile through our comprehensive Ayurvedic assessment.</p>
              {userId ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <div className="welcome-actions">
                  <Link to="/login" className="btn-primary">Get Started</Link>
                </div>
              )}
            </div>
          }
        />
        <Route path="/assessment" element={<ProtectedRoute><ObservationForm /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/wellness-hub" element={<ProtectedRoute><WellnessHub /></ProtectedRoute>} /> {/* New route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;