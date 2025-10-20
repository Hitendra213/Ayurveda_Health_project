// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Ensure bcrypt is used

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', userId: user._id });
  } catch (err) {
    console.error('Login error:', err);
    res.status(400).json({ error: 'Login failed' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const { email, password } = req.headers;
    if (!email || !password) {
      return res.status(401).json({ error: 'Email and password required in headers' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ ...user.toObject(), password: undefined }); // Exclude password
  } catch (err) {
    console.error('Fetch user error:', err);
    res.status(400).json({ error: 'Error fetching user' });
  }
});

router.put('/me', async (req, res) => {
  try {
    const { email, password } = req.headers;
    if (!email || !password) {
      return res.status(401).json({ error: 'Email and password required in headers' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const updateData = {};
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.password) {
      updateData.password = req.body.password; // Will be hashed by pre-save
    }
    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, { new: true }).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(400).json({ error: 'Update failed' });
  }
});

router.delete('/me', async (req, res) => {
  try {
    const { email, password } = req.headers;
    if (!email || !password) {
      return res.status(401).json({ error: 'Email and password required in headers' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    await User.findByIdAndDelete(user._id);
    // Clear localStorage on client side if needed, but handle here
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(400).json({ error: 'Deletion failed' });
  }
});

router.post('/logout', (req, res) => {
  // Stateless, so no server-side session to clear
  res.json({ message: 'Logout successful (client-side localStorage should be cleared)' });
});

module.exports = router;