// src/components/Navbar.js (Updated to include Wellness Hub link)
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  return (
    <nav>
      <div className="nav-container">
        <Link to={userId ? "/dashboard" : "/"} className="logo">Ayurveda Health</Link>
        <div className="nav-links">
          {userId ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/assessment">Assessment</Link>
              <Link to="/reports">Reports</Link>
              <Link to="/wellness-hub">Wellness Hub</Link>
              <Link to="/community">Community</Link>
              <Link to="/profile">Profile</Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;