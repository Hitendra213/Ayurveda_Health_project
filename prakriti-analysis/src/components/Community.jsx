// src/components/Community.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Community.css';

const base_url = 'http://localhost:5000';

const Community = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const fetchUserEmail = async () => {
    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      if (!email || !password) {
        setError('Please log in to access the community.');
        navigate('/login');
        return;
      }
      const response = await axios.get(`${base_url}/api/auth/me`, {
        headers: { email, password },
      });
      setUserEmail(response.data.email);
    } catch (err) {
      setError('Failed to fetch user info.');
      navigate('/login');
    }
  };

  const fetchMessages = async () => {
    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      if (!email || !password) {
        navigate('/login');
        return;
      }
      const response = await axios.get(`${base_url}/api/messages`, {
        headers: { email, password },
      });
      setMessages(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      await axios.post(
        `${base_url}/api/messages`,
        { message: newMessage },
        { headers: { email, password } }
      );
      setNewMessage('');
      fetchMessages(); // Refetch to update list
    } catch (err) {
      console.error('Failed to post message:', err);
      setError('Failed to post message. Please try again.');
    }
  };

  useEffect(() => {
    fetchUserEmail();
    fetchMessages();
  }, []);

  if (loading) {
    return <div className="loading">Loading community...</div>;
  }

  return (
    <div className="community-container">
      <h1>Global Community Chat</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="messages-container">
        {messages.length === 0 ? (
          <p>No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="message">
              <div className="message-header">
                <strong>{msg.userId.email}</strong>
                <span className="message-time">{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
              <p className="message-text">{msg.message}</p>
            </div>
          ))
        )}
      </div>
      {userEmail && (
        <form onSubmit={handleSubmit} className="message-form">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share your thoughts on Ayurveda, health tips, or ask questions..."
            rows={3}
            maxLength={500}
          />
          <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};

export default Community;