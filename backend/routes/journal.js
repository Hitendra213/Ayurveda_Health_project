// backend/routes/journal.js (New routes for journal, similar to assessments)
const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
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
    const journal = new Journal({ ...req.body, userId: req.user.userId });
    await journal.save();
    res.status(201).json(journal);
  } catch (err) {
    console.error('Journal save error:', err);
    res.status(400).json({ error: 'Failed to save journal entry' });
  }
});

router.get('/', authenticateUser, async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(journals);
  } catch (err) {
    console.error('Journal fetch error:', err);
    res.status(400).json({ error: 'Failed to fetch journal entries' });
  }
});

router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const journal = await Journal.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!journal) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    res.json(journal);
  } catch (err) {
    console.error('Journal fetch error:', err);
    res.status(400).json({ error: 'Failed to fetch journal entry' });
  }
});

router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const journal = await Journal.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!journal) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    const updatedJournal = await Journal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJournal);
  } catch (err) {
    console.error('Journal update error:', err);
    res.status(400).json({ error: 'Failed to update journal entry' });
  }
});

router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const journal = await Journal.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!journal) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    await Journal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Journal entry deleted successfully' });
  } catch (err) {
    console.error('Journal delete error:', err);
    res.status(400).json({ error: 'Failed to delete journal entry' });
  }
});

module.exports = router;