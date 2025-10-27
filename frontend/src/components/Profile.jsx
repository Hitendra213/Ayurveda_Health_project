// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css'; // New CSS file

const base_url = 'http://localhost:5000';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: '' });
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUser = async () => {
    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      if (!email || !password) {
        setError('Please log in.');
        setLoading(false);
        navigate('/login');
        return;
      }
      const response = await axios.get(`${base_url}/api/auth/me`, {
        headers: { email, password },
      });
      setUser(response.data);
      setFormData({ email: response.data.email, password: '' });
    } catch (err) {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      await axios.put(`${base_url}/api/auth/me`, formData, {
        headers: { email, password },
      });
      localStorage.setItem('email', formData.email);
      setUser({ ...user, email: formData.email });
      setSuccess('Profile updated successfully!');
      setError('');
    } catch (err) {
      setError('Failed to update profile.');
      setSuccess('');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${base_url}/api/auth/logout`);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      localStorage.removeItem('password');
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <h1>Profile Settings</h1>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">New Password (leave blank to keep current)</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="button-group">
          <button type="submit" className="update-btn">Update Profile</button>
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;