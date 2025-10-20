// Updated Dashboard.js with enhanced health score calculation integrating assessments and journal data
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { User, Activity, Calendar, TrendingUp, BookOpen, Heart, Sun, Moon, Droplets, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [userStats, setUserStats] = useState({
    totalAssessments: 0,
    currentPrakruti: 'Undetermined',
    lastAssessment: null,
    healthScore: 0,
    scoreBreakdown: {} // New: Breakdown for transparency
  });

  const [assessments, setAssessments] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]); // New: Fetch journal data
  const [recentActivities, setRecentActivities] = useState([]);
  const [dailyTips, setDailyTips] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const base_url = 'http://localhost:5000';
  const currentDate = new Date('2025-10-20'); // Given current date

  // Enhanced health score: Integrates assessments, journal mood average, and consistency
  const calculateHealthScore = (assessments, journalEntries) => {
    let score = 0;
    const breakdown = {};

    // 1. Assessment Component (40% weight): Number and recency
    if (assessments.length === 0) {
      breakdown.assessments = 0;
    } else {
      const avgAssessments = Math.min(assessments.length * 10, 32); // Max 32/40
      const daysSinceLast = Math.round((currentDate - new Date(assessments[0].createdAt)) / (1000 * 60 * 60 * 24));
      const recencyBonus = Math.max(0, 8 - daysSinceLast); // Max 8/40
      breakdown.assessments = avgAssessments + recencyBonus;
      score += breakdown.assessments;
    }

    // 2. Journal Mood Average (30% weight): Recent 7-day average mood (1-10 scale)
    const recentJournals = journalEntries
      .filter(entry => new Date(entry.date) >= new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))
      .map(entry => parseInt(entry.mood) || 0);
    if (recentJournals.length === 0) {
      breakdown.journalMood = 0;
    } else {
      const avgMood = recentJournals.reduce((a, b) => a + b, 0) / recentJournals.length;
      breakdown.journalMood = Math.min(Math.round(avgMood * 3), 30); // Scale 1-10 to max 30
      score += breakdown.journalMood;
    }

    // 3. Journal Consistency (20% weight): Number of entries in last 30 days
    const recent30Days = journalEntries
      .filter(entry => new Date(entry.date) >= new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000));
    const consistencyBonus = Math.min(recent30Days.length * 2, 20); // Max 20 for 10+ entries
    breakdown.journalConsistency = consistencyBonus;
    score += consistencyBonus;

    // 4. Prakruti Balance Bonus (10% weight): If dominant is balanced (e.g., mixed), add bonus
    if (assessments.length > 0 && assessments[0].dominantPrakruti.includes('/')) {
      breakdown.prakrutiBalance = 10; // Simple check for mixed doshas
      score += 10;
    } else {
      breakdown.prakrutiBalance = 0;
    }

    const finalScore = Math.min(score, 100);
    breakdown.total = finalScore;
    return finalScore;
  };

  const fetchUserData = async () => {
    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      if (!email || !password) {
        setError('Please log in to view dashboard.');
        setLoading(false);
        return;
      }

      // Fetch assessments
      const assessmentResponse = await axios.get(`${base_url}/api/assessments`, {
        headers: { email, password },
      });
      const sortedAssessments = assessmentResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAssessments(sortedAssessments);

      // Fetch journal entries
      let journalData = [];
      try {
        const journalResponse = await axios.get(`${base_url}/api/journal`, {
          headers: { email, password },
        });
        journalData = journalResponse.data || [];
      } catch (journalErr) {
        console.warn('Journal fetch failed:', journalErr);
        // Graceful degradation: Proceed without journal data
      }
      setJournalEntries(journalData);

      // Calculate enhanced health score
      const healthScore = calculateHealthScore(sortedAssessments, journalData);
      const breakdown = {
        assessments: 0,
        journalMood: 0,
        journalConsistency: 0,
        prakrutiBalance: 0,
        total: healthScore
      };
      if (sortedAssessments.length > 0) {
        const daysSinceLast = Math.round((currentDate - new Date(sortedAssessments[0].createdAt)) / (1000 * 60 * 60 * 24));
        const avgAssessments = Math.min(sortedAssessments.length * 10, 32);
        const recencyBonus = Math.max(0, 8 - daysSinceLast);
        breakdown.assessments = avgAssessments + recencyBonus;
      }
      const recentJournals = journalData.filter(entry => new Date(entry.date) >= new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
      if (recentJournals.length > 0) {
        const avgMood = recentJournals.reduce((a, b) => a + (parseInt(b.mood) || 0), 0) / recentJournals.length;
        breakdown.journalMood = Math.min(Math.round(avgMood * 3), 30);
      }
      const recent30Days = journalData.filter(entry => new Date(entry.date) >= new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000));
      breakdown.journalConsistency = Math.min(recent30Days.length * 2, 20);
      if (sortedAssessments.length > 0 && sortedAssessments[0].dominantPrakruti.includes('/')) {
        breakdown.prakrutiBalance = 10;
      }

      setUserStats({
        totalAssessments: sortedAssessments.length,
        currentPrakruti: sortedAssessments.length > 0 ? sortedAssessments[0].dominantPrakruti : 'Undetermined',
        lastAssessment: sortedAssessments.length > 0 ? sortedAssessments[0].createdAt : null,
        healthScore,
        scoreBreakdown: breakdown
      });

      // Recent activities (from assessments)
      const activities = sortedAssessments.slice(0, 4).map((assess, index) => ({
        id: index + 1,
        action: `Completed Prakruti Assessment (${assess.dominantPrakruti})`,
        date: new Date(assess.createdAt).toLocaleDateString(),
        type: 'assessment'
      }));
      setRecentActivities(activities);

      // Dynamic tips (enhanced with journal if available)
      const tips = [];
      if (sortedAssessments.length > 0) {
        const prakruti = sortedAssessments[0].dominantPrakruti.split('/')[0];
        let tip = `Based on your ${prakruti} prakruti: Focus on balancing foods and routines today.`;
        // Add journal-based tip if recent low mood
        const recentMoodAvg = recentJournals.length > 0 ? recentJournals.reduce((a, b) => a + (parseInt(b.mood) || 0), 0) / recentJournals.length : null;
        if (recentMoodAvg && recentMoodAvg < 5) {
          tip += ` Recent mood suggests adding more grounding practices.`;
        }
        tips.push({
          dosha: prakruti,
          tip,
          icon: prakruti === 'Vata' ? '🌪️' : prakruti === 'Pitta' ? '🔥' : '🌱'
        });
      } else {
        tips.push({
          dosha: 'General',
          tip: 'Start with a new assessment to get personalized tips.',
          icon: '📋'
        });
      }
      setDailyTips(tips);

      // Dynamic reminders based on current date
      const reminders = [
        { id: 1, task: 'Monthly Health Assessment', date: new Date('2025-11-20'), priority: 'high' },
        { id: 2, task: 'Review Diet Plan', date: new Date('2025-10-25'), priority: 'medium' },
        { id: 3, task: 'Update Exercise Routine', date: new Date('2025-10-28'), priority: 'low' },
        // Add journal reminder if no recent entries
        ...(recent30Days.length === 0 ? [{ id: 4, task: 'Log Your First Journal Entry', date: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000), priority: 'high' }] : [])
      ].filter(rem => rem.date > currentDate).slice(0, 3);
      setUpcomingReminders(reminders);

      setError('');
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Aggregate prakruti distribution over all assessments
  const prakrutiData = (() => {
    if (assessments.length === 0) return {};
    const counts = { Vata: 0, Pitta: 0, Kapha: 0 };
    assessments.forEach(assess => {
      const parts = assess.dominantPrakruti.split('/');
      parts.forEach(part => {
        const trimmed = part.trim();
        if (trimmed === 'Vata') counts.Vata++;
        else if (trimmed === 'Pitta') counts.Pitta++;
        else if (trimmed === 'Kapha') counts.Kapha++;
      });
    });
    const totalDoshaMentions = Object.values(counts).reduce((a, b) => a + b, 0);
    return {
      Vata: { 
        percentage: totalDoshaMentions > 0 ? Math.round((counts.Vata / totalDoshaMentions) * 100) : 0, 
        color: '#4299e1', 
        traits: ['Creative', 'Quick-thinking', 'Energetic'] 
      },
      Pitta: { 
        percentage: totalDoshaMentions > 0 ? Math.round((counts.Pitta / totalDoshaMentions) * 100) : 0, 
        color: '#f56565', 
        traits: ['Focused', 'Determined', 'Organized'] 
      },
      Kapha: { 
        percentage: totalDoshaMentions > 0 ? Math.round((counts.Kapha / totalDoshaMentions) * 100) : 0, 
        color: '#48bb78', 
        traits: ['Calm', 'Stable', 'Compassionate'] 
      }
    };
  })();

  const daysSinceLast = userStats.lastAssessment ? 
    Math.round((currentDate - new Date(userStats.lastAssessment)) / (1000 * 60 * 60 * 24)) : 0;

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      {error && <div className="error-message bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome to Your Ayurveda Health Journey</h1>
          <p>Track your constitution, monitor your wellness, and receive personalized recommendations</p>
        </div>
        <div className="user-avatar">
          <User size={48} />
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <h3>{userStats.totalAssessments}</h3>
            <p>Total Assessments</p>
          </div>
        </div>
        <div className="stat-card secondary">
          <div className="stat-icon">
            <Heart size={24} />
          </div>
          <div className="stat-content">
            <h3>{userStats.healthScore}%</h3>
            <p>Health Score</p>
            {/* New: Breakdown tooltip or popover - simple inline for now */}
            <div className="score-breakdown">
              <small>Assess: {userStats.scoreBreakdown.assessments}/40 | Mood: {userStats.scoreBreakdown.journalMood}/30 | Consist: {userStats.scoreBreakdown.journalConsistency}/20 | Balance: {userStats.scoreBreakdown.prakrutiBalance}/10</small>
            </div>
          </div>
        </div>
        <div className="stat-card tertiary">
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <h3>{userStats.currentPrakruti}</h3>
            <p>Current Prakruti</p>
          </div>
        </div>
        <div className="stat-card quaternary">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>{daysSinceLast} days</h3>
            <p>Since Last Assessment</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Prakruti Distribution */}
        <div className="dashboard-card prakruti-card">
          <h2>Your Prakruti Distribution</h2>
          {Object.keys(prakrutiData).length > 0 ? (
            <div className="prakruti-chart">
              {Object.entries(prakrutiData).map(([dosha, data]) => (
                <div key={dosha} className="prakruti-item">
                  <div className="prakruti-header">
                    <span className="dosha-name">{dosha}</span>
                    <span className="dosha-percentage">{data.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${data.percentage}%`, backgroundColor: data.color }}
                    ></div>
                  </div>
                  <div className="dosha-traits">
                    {data.traits.map((trait, index) => (
                      <span key={index} className="trait-tag">{trait}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Complete an assessment to see your prakruti distribution.</p>
          )}
        </div>

        {/* Health Metrics */}
        <div className="dashboard-card metrics-card">
          <h2>Health Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-header">
                <div className="metric-icon" style={{ color: '#4299e1' }}>
                  <Sun size={20} />
                </div>
                <span className="metric-value">78%</span>
              </div>
              <p className="metric-label">Energy Level</p>
              <div className="metric-bar">
                <div className="metric-fill" style={{ width: '78%', backgroundColor: '#4299e1' }}></div>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-header">
                <div className="metric-icon" style={{ color: '#805ad5' }}>
                  <Moon size={20} />
                </div>
                <span className="metric-value">85%</span>
              </div>
              <p className="metric-label">Sleep Quality</p>
              <div className="metric-bar">
                <div className="metric-fill" style={{ width: '85%', backgroundColor: '#805ad5' }}></div>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-header">
                <div className="metric-icon" style={{ color: '#48bb78' }}>
                  <Activity size={20} />
                </div>
                <span className="metric-value">72%</span>
              </div>
              <p className="metric-label">Digestion</p>
              <div className="metric-bar">
                <div className="metric-fill" style={{ width: '72%', backgroundColor: '#48bb78' }}></div>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-header">
                <div className="metric-icon" style={{ color: '#f56565' }}>
                  <TrendingUp size={20} />
                </div>
                <span className="metric-value">90%</span>
              </div>
              <p className="metric-label">Mental Clarity</p>
              <div className="metric-bar">
                <div className="metric-fill" style={{ width: '90%', backgroundColor: '#f56565' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Tips */}
        <div className="dashboard-card tips-card">
          <h2>Daily Ayurvedic Tips</h2>
          <div className="tips-list">
            {dailyTips.map((tip, index) => (
              <div key={index} className="tip-item">
                <div className="tip-icon">{tip.icon}</div>
                <div className="tip-content">
                  <h4>{tip.dosha} Tip</h4>
                  <p>{tip.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="dashboard-card activities-card">
          <h2>Recent Activities</h2>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-dot ${activity.type}`}></div>
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <span className="activity-date">{activity.date}</span>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && <p>No recent activities. Start an assessment!</p>}
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="dashboard-card reminders-card">
          <h2>Upcoming Reminders</h2>
          <div className="reminders-list">
            {upcomingReminders.map((reminder) => (
              <div key={reminder.id} className="reminder-item">
                <div className={`priority-indicator ${reminder.priority}`}></div>
                <div className="reminder-content">
                  <p className="reminder-task">{reminder.task}</p>
                  <span className="reminder-date">{reminder.date.toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {upcomingReminders.length === 0 && <p>All caught up! Great job.</p>}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card actions-card">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/assessment" className="action-btn primary">
              <Activity size={20} />
              <span>New Assessment</span>
            </Link>
            <Link to="/reports" className="action-btn secondary">
              <BookOpen size={20} />
              <span>View Reports</span>
            </Link>
            <Link to="/wellness-hub" className="action-btn tertiary">
              <Users size={20} />
              <span>Wellness Hub</span>
            </Link>
            <Link to="/profile" className="action-btn quaternary">
              <Calendar size={20} />
              <span>Profile Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;