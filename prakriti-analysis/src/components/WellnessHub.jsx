// src/components/WellnessHub.js (Updated with full weekly meal generation)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './WellnessHub.css';
import { BookOpen, Sun, Edit3, Save } from 'lucide-react';

const base_url = 'http://localhost:5000';

// Expanded dosha-specific meal plans for full week
const mealPlans = {
  Vata: {
    title: 'Vata-Balancing Weekly Plan',
    meals: [
      { day: 'Monday', breakfast: 'Warm oatmeal with ghee and nuts', lunch: 'Stewed vegetables with rice', dinner: 'Root vegetable soup', tips: 'Focus on warm, moist foods.' },
      { day: 'Tuesday', breakfast: 'Spiced porridge with almond milk', lunch: 'Lentil stew with quinoa', dinner: 'Baked sweet potatoes with butter', tips: 'Avoid raw salads; add grounding spices.' },
      { day: 'Wednesday', breakfast: 'Hot herbal tea with toast and avocado', lunch: 'Creamy pumpkin soup', dinner: 'Steamed carrots and rice', tips: 'Incorporate sweet tastes for stability.' },
      { day: 'Thursday', breakfast: 'Cooked apples with cinnamon', lunch: 'Vegetable curry with basmati rice', dinner: 'Mashed potatoes with ghee', tips: 'Keep meals oily and cooked.' },
      { day: 'Friday', breakfast: 'Warm milk with dates', lunch: 'Beetroot stew', dinner: 'Zucchini noodles with tahini sauce', tips: 'Emphasize routine eating times.' },
      { day: 'Saturday', breakfast: 'Oatmeal pancakes with maple syrup', lunch: 'Chickpea curry', dinner: 'Butternut squash soup', tips: 'Stay hydrated with warm water.' },
      { day: 'Sunday', breakfast: 'Spiced rice pudding', lunch: 'Sweet potato hash', dinner: 'Lentil dal with naan', tips: 'Rest and reflect on the week.' }
    ]
  },
  Pitta: {
    title: 'Pitta-Cooling Weekly Plan',
    meals: [
      { day: 'Monday', breakfast: 'Cucumber mint smoothie', lunch: 'Coconut rice with greens', dinner: 'Cool yogurt curry with cucumber', tips: 'Emphasize sweet and bitter tastes.' },
      { day: 'Tuesday', breakfast: 'Chilled fruit bowl with yogurt', lunch: 'Quinoa salad with mint and lime', dinner: 'Steamed veggies with coconut milk', tips: 'Skip spicy foods; add cooling herbs.' },
      { day: 'Wednesday', breakfast: 'Pomegranate and pear salad', lunch: 'Barley soup with dill', dinner: 'Sweet potato with tahini', tips: 'Avoid sour or fermented items.' },
      { day: 'Thursday', breakfast: 'Coconut chia pudding', lunch: 'Green bean stir-fry (mild)', dinner: 'Rice pudding with rose water', tips: 'Eat in a calm environment.' },
      { day: 'Friday', breakfast: 'Melon smoothie', lunch: 'Lentil salad with cucumber', dinner: 'Zucchini soup', tips: 'Focus on fresh, uncooked greens.' },
      { day: 'Saturday', breakfast: 'Apple and fennel salad', lunch: 'Couscous with herbs', dinner: 'Coconut curry (mild)', tips: 'Limit salt and oil.' },
      { day: 'Sunday', breakfast: 'Berry yogurt parfait', lunch: 'Vegetable khichdi (cooling spices)', dinner: 'Pear compote', tips: 'Wind down with light meals.' }
    ]
  },
  Kapha: {
    title: 'Kapha-Energizing Weekly Plan',
    meals: [
      { day: 'Monday', breakfast: 'Spicy ginger tea with light toast', lunch: 'Bean soup with spices', dinner: 'Stir-fried greens with chili', tips: 'Opt for light, dry meals.' },
      { day: 'Tuesday', breakfast: 'Apple cider vinegar drink with lemon', lunch: 'Spicy lentil salad', dinner: 'Bitter greens stir-fry', tips: 'Minimize dairy; add pungent spices.' },
      { day: 'Wednesday', breakfast: 'Black tea with cayenne', lunch: 'Chickpea stew with turmeric', dinner: 'Roasted broccoli with garlic', tips: 'Incorporate bitter and astringent tastes.' },
      { day: 'Thursday', breakfast: 'Dry toast with mustard', lunch: 'Quinoa with radish and fenugreek', dinner: 'Spicy vegetable soup', tips: 'Keep portions small.' },
      { day: 'Friday', breakfast: 'Ginger-lemon shot', lunch: 'Black bean salad with lime', dinner: 'Cauliflower rice with spices', tips: 'Avoid sweets and heavy carbs.' },
      { day: 'Saturday', breakfast: 'Spiced herbal tea', lunch: 'Lentil curry (hot)', dinner: 'Kale chips with chili', tips: 'Stimulate digestion with spices.' },
      { day: 'Sunday', breakfast: 'Cayenne pepper toast', lunch: 'Mung bean soup', dinner: 'Spicy slaw', tips: 'End the week with invigorating flavors.' }
    ]
  }
};

// Sample journal prompts based on dosha
const journalPrompts = {
  Vata: 'How did grounding activities affect your energy today?',
  Pitta: 'What helped you stay cool under pressure?',
  Kapha: 'What movement kept you motivated today?'
};

const WellnessHub = () => {
  const navigate = useNavigate();
  const [userPrakruti, setUserPrakruti] = useState('Undetermined');
  const [mealPlan, setMealPlan] = useState(null);
  const [showFullWeek, setShowFullWeek] = useState(false);
  const [journalEntry, setJournalEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: '',
    symptoms: '',
    notes: '',
    doshaInsights: ''
  });
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUserData = async () => {
    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      if (!email || !password) {
        setError('Please log in to access wellness features.');
        setLoading(false);
        navigate('/login');
        return;
      }

      // Fetch latest assessment for prakruti
      const response = await axios.get(`${base_url}/api/assessments`, {
        headers: { email, password },
      });
      const assessments = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (assessments.length > 0) {
        const dominant = assessments[0].dominantPrakruti.split('/')[0];
        setUserPrakruti(dominant);
        setMealPlan(mealPlans[dominant] || { title: 'General Plan', meals: [] });
      }

      // Fetch journal entries
      try {
        const journalResponse = await axios.get(`${base_url}/api/journal`, {
          headers: { email, password },
        });
        setJournalEntries(journalResponse.data || []);
      } catch (journalErr) {
        console.warn('Journal fetch failed (endpoint may not exist yet):', journalErr);
        setJournalEntries([]); // Graceful fallback
      }

      setError('');
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load wellness data. Using defaults.');
      // Fallback to general plan
      setMealPlan({ title: 'General Wellness Plan', meals: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleJournalChange = (e) => {
    const { name, value } = e.target;
    setJournalEntry(prev => ({ ...prev, [name]: value }));
  };

  const saveJournalEntry = async () => {
    if (!journalEntry.mood || !journalEntry.notes.trim()) {
      setError('Please fill in mood and notes.');
      return;
    }
    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      const entryToSave = {
        ...journalEntry,
        prakruti: userPrakruti,
        doshaInsights: journalPrompts[userPrakruti] ? `${journalPrompts[userPrakruti]} ${journalEntry.notes}` : journalEntry.notes
      };
      const response = await axios.post(`${base_url}/api/journal`, entryToSave, {
        headers: { email, password },
      });
      setJournalEntries(prev => [response.data, ...prev]);
      setJournalEntry({ date: new Date().toISOString().split('T')[0], mood: '', symptoms: '', notes: '', doshaInsights: '' });
      setSuccess('Journal entry saved!');
      setError('');
    } catch (err) {
      console.error('Failed to save journal entry:', err);
      setError('Failed to save journal entry. Check if backend endpoint is set up.');
    }
  };

  const generateFullWeek = () => {
    setShowFullWeek(true);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) return <div className="loading">Loading wellness hub...</div>;

  return (
    <div className="wellness-hub-container">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="hub-header">
        <h1>Wellness Hub</h1>
        <p>Your personalized space for diet planning and daily reflections</p>
      </div>

      <div className="hub-grid">
        {/* Personalized Diet Planner Section */}
        <div className="planner-section dashboard-card">
          <h2>Personalized Diet Planner</h2>
          <p className="prakruti-info">Based on your {userPrakruti} Prakruti</p>
          {mealPlan && (
            <div className="meal-plan">
              <h3>{mealPlan.title}</h3>
              <div className="meals-list">
                {(showFullWeek ? mealPlan.meals : mealPlan.meals.slice(0, 3)).map((meal, index) => (
                  <div key={index} className="meal-day">
                    <h4>{meal.day}</h4>
                    <ul>
                      <li><strong>Breakfast:</strong> {meal.breakfast}</li>
                      <li><strong>Lunch:</strong> {meal.lunch}</li>
                      <li><strong>Dinner:</strong> {meal.dinner}</li>
                    </ul>
                    <p className="meal-tips">{meal.tips}</p>
                  </div>
                ))}
                {!showFullWeek && mealPlan.meals.length > 3 && <p><em>View full week below...</em></p>}
              </div>
              {!showFullWeek ? (
                <button className="generate-btn" onClick={generateFullWeek}>
                  <BookOpen size={16} /> Generate Full Week
                </button>
              ) : (
                <button className="generate-btn" onClick={() => setShowFullWeek(false)}>
                  <BookOpen size={16} /> Show Preview
                </button>
              )}
            </div>
          )}
          {userPrakruti === 'Undetermined' && (
            <p>Complete an assessment to unlock personalized plans.</p>
          )}
        </div>

        {/* Daily Wellness Journal Section */}
        <div className="journal-section dashboard-card">
          <h2>Daily Wellness Journal</h2>
          <form className="journal-form">
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" value={journalEntry.date} onChange={handleJournalChange} />
            </div>
            <div className="form-group">
              <label>Mood (1-10)</label>
              <input type="number" name="mood" min="1" max="10" value={journalEntry.mood} onChange={handleJournalChange} placeholder="e.g., 7" />
            </div>
            <div className="form-group">
              <label>Symptoms</label>
              <textarea name="symptoms" value={journalEntry.symptoms} onChange={handleJournalChange} placeholder="e.g., Fatigue, good digestion" rows={2} />
            </div>
            <div className="form-group">
              <label>Notes & Reflections</label>
              <textarea name="notes" value={journalEntry.notes} onChange={handleJournalChange} placeholder={journalPrompts[userPrakruti] || 'How was your day?'} rows={4} />
            </div>
            <div className="form-group">
              <label>Dosha Insights</label>
              <textarea name="doshaInsights" value={journalEntry.doshaInsights} onChange={handleJournalChange} placeholder="Personal reflections..." rows={2} />
            </div>
            <button type="button" className="save-btn" onClick={saveJournalEntry}>
              <Save size={16} /> Save Entry
            </button>
          </form>

          {/* Recent Entries */}
          <div className="recent-entries">
            <h3>Recent Entries</h3>
            {journalEntries.slice(0, 3).map((entry, index) => (
              <div key={index} className="entry-card">
                <p><strong>{new Date(entry.date).toLocaleDateString()}:</strong> Mood {entry.mood} - {entry.symptoms}</p>
                <p>{entry.notes.substring(0, 50)}...</p>
              </div>
            ))}
            {journalEntries.length === 0 && <p>No entries yet. Start journaling!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessHub;