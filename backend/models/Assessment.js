// backend/models/Assessment.js
const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skinType: [String],
  bodyBuild: String,
  hairType: [String],
  eyeDescription: String,
  mindset: [String],
  memory: String,
  emotions: String,
  dietPreferences: String,
  sleepPatterns: String,
  energyLevels: String,
  weatherPreferences: String,
  stressResponse: String,
  dominantPrakruti: String,
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);