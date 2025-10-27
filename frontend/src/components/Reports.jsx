// src/components/Reports.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Reports.css';

const base_url = 'http://localhost:5000';

const prakrutiRecommendations = {
  Vata: {
    food: 'Eat warm, moist, and grounding foods. Avoid cold and dry items.',
    exercise: 'Gentle yoga, stretching, and routine practices are best.',
    lifestyle: 'Maintain regular sleep and meal times.',
  },
  Pitta: {
    food: 'Prefer cooling, non-spicy foods. Avoid alcohol, vinegar, and caffeine.',
    exercise: 'Swimming, walking, and non-competitive sports.',
    lifestyle: 'Take breaks, avoid overworking, and stay cool mentally/physically.',
  },
  Kapha: {
    food: 'Eat light, spicy, and dry foods. Avoid sweets and fried items.',
    exercise: 'Daily intense exercise is helpful.',
    lifestyle: 'Stay active and avoid oversleeping.',
  },
};

const getRecommendations = (dominant) => {
  return dominant.split('/').map((type) => ({
    type,
    ...prakrutiRecommendations[type],
  }));
};

const prakrutiTraits = {
  skinType: { Vata: ['Dry'], Pitta: ['Oily'], Kapha: ['Balanced'] },
  bodyBuild: { Vata: 'Thin', Pitta: 'Muscular', Kapha: 'Heavier' },
  hairType: { Vata: ['Dry', 'Thin'], Pitta: ['Oily', 'Thinning'], Kapha: ['Thick', 'Oily'] },
  mindset: { Vata: ['Restless'], Pitta: ['Intense'], Kapha: ['Calm'] },
  memory: { Vata: 'Tends to Forget', Pitta: 'Remembers Easily', Kapha: 'Slow but long-term' },
  emotions: { Vata: 'Anxious', Pitta: 'Angry', Kapha: 'Content' },
  dietPreferences: { Vata: 'Warm', Pitta: 'Cold, spicy', Kapha: 'Light, sweet' },
  sleepPatterns: { Vata: 'Light', Pitta: 'Moderate', Kapha: 'Deep' },
  energyLevels: { Vata: 'Variable', Pitta: 'High, bursts', Kapha: 'Steady' },
  weatherPreferences: { Vata: 'Warm', Pitta: 'Cool', Kapha: 'Warm and dry' },
  stressResponse: { Vata: 'Anxious', Pitta: 'Irritable', Kapha: 'Calm' },
};

const Reports = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAssessments = async () => {
    try {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      if (!email || !password) {
        setError('Please log in to view reports.');
        setLoading(false);
        navigate('/login');
        return;
      }
      const response = await axios.get(`${base_url}/api/assessments`, {
        headers: { email, password },
      });
      setAssessments(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (assessment) => {
    const dataStr = JSON.stringify(assessment, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `assessment_${assessment._id}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleViewDetails = (assessment) => {
    setSelectedAssessment(assessment);
  };

  const handleBackToList = () => {
    setSelectedAssessment(null);
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  if (loading) return <div className="loading">Loading reports...</div>;

  const dominantPrakruti = selectedAssessment ? selectedAssessment.dominantPrakruti : '';
  const recommendations = dominantPrakruti !== 'Undetermined' ? getRecommendations(dominantPrakruti) : [];
  const displayData = selectedAssessment;

  if (selectedAssessment) {
    return (
      <div className="container">
        {error && (
          <div className="error-message bg-red-100 text-red-700 p-3 mb-4 rounded">
            {error}
          </div>
        )}
        <div className="summary-table-container">
          <div className="header-section">
            <h2>Prakruti Analysis - {new Date(selectedAssessment.createdAt).toLocaleDateString()}</h2>
            <div className="button-group header-buttons">
              <button onClick={() => handleExport(selectedAssessment)} className="export-btn">Export JSON</button>
              <button onClick={handleBackToList} className="back-btn">Back to Reports</button>
            </div>
          </div>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Trait</th>
                <th>Vata</th>
                <th>Pitta</th>
                <th>Kapha</th>
                <th>My Traits</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Skin Type</td>
                <td>{(prakrutiTraits.skinType.Vata || []).join(', ')}</td>
                <td>{(prakrutiTraits.skinType.Pitta || []).join(', ')}</td>
                <td>{(prakrutiTraits.skinType.Kapha || []).join(', ')}</td>
                <td>{displayData.skinType.join(', ') || 'None'}</td>
              </tr>
              <tr>
                <td>Body Build</td>
                <td>{prakrutiTraits.bodyBuild.Vata}</td>
                <td>{prakrutiTraits.bodyBuild.Pitta}</td>
                <td>{prakrutiTraits.bodyBuild.Kapha}</td>
                <td>{displayData.bodyBuild || 'None'}</td>
              </tr>
              <tr>
                <td>Hair Type</td>
                <td>{(prakrutiTraits.hairType.Vata || []).join(', ')}</td>
                <td>{(prakrutiTraits.hairType.Pitta || []).join(', ')}</td>
                <td>{(prakrutiTraits.hairType.Kapha || []).join(', ')}</td>
                <td>{displayData.hairType.join(', ') || 'None'}</td>
              </tr>
              <tr>
                <td>Eyes</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>{displayData.eyeDescription || 'None'}</td>
              </tr>
              <tr>
                <td>Mindset</td>
                <td>{(prakrutiTraits.mindset.Vata || []).join(', ')}</td>
                <td>{(prakrutiTraits.mindset.Pitta || []).join(', ')}</td>
                <td>{(prakrutiTraits.mindset.Kapha || []).join(', ')}</td>
                <td>{displayData.mindset.join(', ') || 'None'}</td>
              </tr>
              <tr>
                <td>Memory</td>
                <td>{prakrutiTraits.memory.Vata}</td>
                <td>{prakrutiTraits.memory.Pitta}</td>
                <td>{prakrutiTraits.memory.Kapha}</td>
                <td>{displayData.memory || 'None'}</td>
              </tr>
              <tr>
                <td>Emotions</td>
                <td>{prakrutiTraits.emotions.Vata}</td>
                <td>{prakrutiTraits.emotions.Pitta}</td>
                <td>{prakrutiTraits.emotions.Kapha}</td>
                <td>{displayData.emotions || 'None'}</td>
              </tr>
              <tr>
                <td>Diet Preferences</td>
                <td>{prakrutiTraits.dietPreferences.Vata}</td>
                <td>{prakrutiTraits.dietPreferences.Pitta}</td>
                <td>{prakrutiTraits.dietPreferences.Kapha}</td>
                <td>{displayData.dietPreferences || 'None'}</td>
              </tr>
              <tr>
                <td>Sleep Patterns</td>
                <td>{prakrutiTraits.sleepPatterns.Vata}</td>
                <td>{prakrutiTraits.sleepPatterns.Pitta}</td>
                <td>{prakrutiTraits.sleepPatterns.Kapha}</td>
                <td>{displayData.sleepPatterns || 'None'}</td>
              </tr>
              <tr>
                <td>Energy Levels</td>
                <td>{prakrutiTraits.energyLevels.Vata}</td>
                <td>{prakrutiTraits.energyLevels.Pitta}</td>
                <td>{prakrutiTraits.energyLevels.Kapha}</td>
                <td>{displayData.energyLevels || 'None'}</td>
              </tr>
              <tr>
                <td>Weather Preferences</td>
                <td>{prakrutiTraits.weatherPreferences.Vata}</td>
                <td>{prakrutiTraits.weatherPreferences.Pitta}</td>
                <td>{prakrutiTraits.weatherPreferences.Kapha}</td>
                <td>{displayData.weatherPreferences || 'None'}</td>
              </tr>
              <tr>
                <td>Stress Response</td>
                <td>{prakrutiTraits.stressResponse.Vata}</td>
                <td>{prakrutiTraits.stressResponse.Pitta}</td>
                <td>{prakrutiTraits.stressResponse.Kapha}</td>
                <td>{displayData.stressResponse || 'None'}</td>
              </tr>
              <tr>
                <td colSpan="4">Dominant Prakruti</td>
                <td>{dominantPrakruti}</td>
              </tr>
            </tbody>
          </table>

          {recommendations.length > 0 && (
            <div className="recommendations">
              <h2>Recommendations for Your Prakruti</h2>
              {recommendations.map((rec, index) => (
                <div key={index}>
                  <h3>{rec.type} Recommendations</h3>
                  <ul>
                    <li><strong>Food:</strong> {rec.food}</li>
                    <li><strong>Exercise:</strong> {rec.exercise}</li>
                    <li><strong>Lifestyle:</strong> {rec.lifestyle}</li>
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {error && (
        <div className="error-message bg-red-100 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}
      <div className="reports-container">
        <h1>Your Assessment Reports</h1>
        {assessments.length === 0 ? (
          <div className="no-assessments">
            <p>No assessments found.</p>
            <a href="/assessment" className="take-assessment-link">
              Take one now!
            </a>
          </div>
        ) : (
          <div className="reports-grid">
            {assessments.map((assessment) => (
              <div key={assessment._id} className="report-card">
                <h3>Assessment on {new Date(assessment.createdAt).toLocaleDateString()}</h3>
                <p><strong>Dominant Prakruti:</strong> {assessment.dominantPrakruti}</p>
                <p><strong>Skin Type:</strong> {assessment.skinType.join(', ') || 'None'}</p>
                <p><strong>Body Build:</strong> {assessment.bodyBuild || 'None'}</p>
                {/* Add more fields as needed */}
                <div className="report-actions">
                  <button 
                    onClick={() => handleExport(assessment)}
                    className="export-btn"
                  >
                    Export JSON
                  </button>
                  <button 
                    onClick={() => handleViewDetails(assessment)}
                    className="view-details-btn"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;