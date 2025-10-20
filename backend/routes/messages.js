// backend/routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  try {
    const { email, password } = req.headers;
    if (!email || !password) {
      return res.status(401).json({ error: 'Email and password required in headers' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.user = { userId: user._id };
    next();
  } catch (err) {
    res.status(400).json({ error: 'Authentication failed' });
  }
};

router.post('/', authenticateUser, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const newMessage = new Message({ userId: req.user.userId, message: message.trim() });
    await newMessage.save();
    const populatedMessage = await Message.findById(newMessage._id).populate('userId', 'email');
    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error('Post message error:', err);
    res.status(400).json({ error: 'Failed to post message' });
  }
});

router.get('/', authenticateUser, async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('userId', 'email')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(messages);
  } catch (err) {
    console.error('Fetch messages error:', err);
    res.status(400).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;