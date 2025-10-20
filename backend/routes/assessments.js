const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
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
    const assessment = new Assessment({ ...req.body, userId: req.user.userId });
    await assessment.save();
    res.status(201).json(assessment);
  } catch (err) {
    res.status(400).json({ error: 'Failed to save assessment' });
  }
});

router.get('/', authenticateUser, async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(assessments);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch assessments' });
  }
});

router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const assessment = await Assessment.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch assessment' });
  }
});

module.exports = router;