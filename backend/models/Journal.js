// backend/models/Journal.js (New model for journal entries)
const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  mood: { type: Number, min: 1, max: 10 },
  symptoms: String,
  notes: String,
  doshaInsights: String,
  prakruti: String, // Reference to user's dominant prakruti at time of entry
}, { timestamps: true });

module.exports = mongoose.model('Journal', journalSchema);