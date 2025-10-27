// src/components/ObservationForm.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ObservationForm.css';

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

const ObservationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    skinType: [],
    bodyBuild: '',
    hairType: [],
    eyeDescription: '',
    mindset: [],
    memory: '',
    emotions: '',
    dietPreferences: '',
    sleepPatterns: '',
    energyLevels: '',
    weatherPreferences: '',
    stressResponse: '',
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const summaryRef = useRef();

  const steps = [
    {
      id: 0,
      title: 'Physical Traits - Skin Type',
      field: 'skinType',
      type: 'checkbox',
      options: ['Dry', 'Oily', 'Balanced'],
      validate: () => formData.skinType.length > 0,
    },
    {
      id: 1,
      title: 'Physical Traits - Body Build',
      field: 'bodyBuild',
      type: 'radio',
      options: ['Thin', 'Muscular', 'Heavier'],
      validate: () => formData.bodyBuild !== '',
    },
    {
      id: 2,
      title: 'Physical Traits - Hair Type',
      field: 'hairType',
      type: 'checkbox',
      options: ['Dry', 'Oily', 'Thick', 'Thin', 'Thinning'],
      validate: () => formData.hairType.length > 0,
    },
    {
      id: 3,
      title: 'Physical Traits - Eyes',
      field: 'eyeDescription',
      type: 'textarea',
      placeholder: 'Describe your eyes (e.g., size, color, brightness)',
      validate: () => formData.eyeDescription.trim() !== '',
    },
    {
      id: 4,
      title: 'Mental Traits - Mindset',
      field: 'mindset',
      type: 'checkbox',
      options: ['Calm', 'Intense', 'Restless'],
      validate: () => formData.mindset.length > 0,
    },
    {
      id: 5,
      title: 'Mental Traits - Memory',
      field: 'memory',
      type: 'radio',
      options: ['Remembers Easily', 'Tends to Forget', 'Slow but long-term'],
      validate: () => formData.memory !== '',
    },
    {
      id: 6,
      title: 'Emotional Traits - Emotions',
      field: 'emotions',
      type: 'textarea',
      placeholder: 'Describe your emotional tendencies (e.g., anger, anxiety, content)',
      validate: () => formData.emotions.trim() !== '',
    },
    {
      id: 7,
      title: 'Daily Habits - Diet Preferences',
      field: 'dietPreferences',
      type: 'textarea',
      placeholder: 'Describe your dietary preferences (e.g., hot, cold, spicy, sweet)',
      validate: () => formData.dietPreferences.trim() !== '',
    },
    {
      id: 8,
      title: 'Daily Habits - Sleep Patterns',
      field: 'sleepPatterns',
      type: 'textarea',
      placeholder: 'Describe your sleep patterns (e.g., deep, light, trouble sleeping)',
      validate: () => formData.sleepPatterns.trim() !== '',
    },
    {
      id: 9,
      title: 'Daily Habits - Energy Levels',
      field: 'energyLevels',
      type: 'radio',
      options: ['Variable', 'High, bursts', 'Steady'],
      validate: () => formData.energyLevels !== '',
    },
    {
      id: 10,
      title: 'Environmental - Weather Preferences',
      field: 'weatherPreferences',
      type: 'radio',
      options: ['Warm', 'Cool', 'Warm and dry'],
      validate: () => formData.weatherPreferences !== '',
    },
    {
      id: 11,
      title: 'Environmental - Stress Response',
      field: 'stressResponse',
      type: 'textarea',
      placeholder: 'Describe your stress response (e.g., anxious, irritable, calm)',
      validate: () => formData.stressResponse.trim() !== '',
    },
  ];

  const totalSteps = steps.length;

  const errorMessages = {
    skinType: 'Select at least one skin type',
    bodyBuild: 'Select a body build',
    hairType: 'Select at least one hair type',
    eyeDescription: 'Describe your eyes',
    mindset: 'Select at least one mindset',
    memory: 'Select a memory tendency',
    emotions: 'Describe your emotions',
    dietPreferences: 'Describe your diet preferences',
    sleepPatterns: 'Describe your sleep patterns',
    energyLevels: 'Select an energy level',
    weatherPreferences: 'Select a weather preference',
    stressResponse: 'Describe your stress response',
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

  const calculatePrakruti = () => {
    const scores = { Vata: 0, Pitta: 0, Kapha: 0 };
    Object.keys(formData).forEach((key) => {
      if (!prakrutiTraits[key]) return;
      const userValue = formData[key];
      if (Array.isArray(userValue) && userValue.length > 0) {
        ['Vata', 'Pitta', 'Kapha'].forEach((dosha) => {
          const doshaTraits = prakrutiTraits[key][dosha] || [];
          if (Array.isArray(doshaTraits)) {
            if (userValue.some((val) => doshaTraits.some((trait) => 
              val.toLowerCase().includes(trait.toLowerCase()) || trait.toLowerCase().includes(val.toLowerCase())
            ))) {
              scores[dosha]++;
            }
          }
        });
      } else if (userValue && typeof userValue === 'string' && userValue.trim()) {
        ['Vata', 'Pitta', 'Kapha'].forEach((dosha) => {
          const doshaTrait = prakrutiTraits[key][dosha];
          if (typeof doshaTrait === 'string' && (
            userValue.toLowerCase().includes(doshaTrait.toLowerCase()) || 
            doshaTrait.toLowerCase().includes(userValue.toLowerCase().split(' ').find(word => word.length > 3)?.toLowerCase() || '')
          )) {
            scores[dosha]++;
          }
        });
      }
    });
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return 'Undetermined';
    return Object.keys(scores).filter((dosha) => scores[dosha] === maxScore).join('/');
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedValues = checked
        ? [...prev[field], value]
        : prev[field].filter((v) => v !== value);
      if (updatedValues.length > 0) {
        setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
      }
      return { ...prev, [field]: updatedValues };
    });
  };

  const handleRadioChange = (e, field) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleNext = async () => {
    const step = steps[currentStep];
    const field = step.field;
    if (!step.validate()) {
      setErrors((prev) => ({ ...prev, [field]: errorMessages[field] }));
      return;
    }
    setErrors((prev) => ({ ...prev, [field]: '' }));
    if (currentStep === totalSteps - 1) {
      const calculatedPrakruti = calculatePrakruti();
      setShowSummary(true);
      setErrorMessage('');
      try {
        const userId = localStorage.getItem('userId');
        const email = localStorage.getItem('email');
        const password = localStorage.getItem('password');
        if (!userId || !email || !password) {
          setErrorMessage('Please log in to save your assessment.');
          navigate('/login');
          return;
        }
        const assessmentData = { ...formData, dominantPrakruti: calculatedPrakruti };
        await axios.post(`${base_url}/api/assessments`, assessmentData, {
          headers: { email, password },
        });
        fetchAssessments();
      } catch (err) {
        console.error('Failed to save assessment:', err.response?.data || err.message);
        setErrorMessage('Failed to save assessment to the server. The analysis is still shown below.');
      }
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const fetchAssessments = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      if (!userId || !email || !password) {
        setErrorMessage('Please log in to view past assessments.');
        navigate('/login');
        return;
      }
      const response = await axios.get(`${base_url}/api/assessments`, {
        headers: { email, password },
      });
      setAssessments(response.data);
      setErrorMessage('');
    } catch (err) {
      console.error('Failed to fetch assessments:', err.response?.data || err.message);
      setErrorMessage('Failed to fetch past assessments. Please try again later.');
    }
  };

  const fetchAssessmentById = async (id) => {
    try {
      const userId = localStorage.getItem('userId');
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      if (!userId || !email || !password) {
        setErrorMessage('Please log in to view assessment details.');
        navigate('/login');
        return;
      }
      const response = await axios.get(`${base_url}/api/assessments/${id}`, {
        headers: { email, password },
      });
      setSelectedAssessment(response.data);
      setShowSummary(true);
      setErrorMessage('');
    } catch (err) {
      console.error('Failed to fetch assessment:', err.response?.data || err.message);
      setErrorMessage('Failed to fetch assessment details. Please try again later.');
    }
  };

  const handleReset = () => {
    setFormData({
      skinType: [],
      bodyBuild: '',
      hairType: [],
      eyeDescription: '',
      mindset: [],
      memory: '',
      emotions: '',
      dietPreferences: '',
      sleepPatterns: '',
      energyLevels: '',
      weatherPreferences: '',
      stressResponse: '',
    });
    setErrors({});
    setShowSummary(false);
    setSelectedAssessment(null);
    setErrorMessage('');
    setCurrentStep(0);
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const dominantPrakruti = selectedAssessment ? selectedAssessment.dominantPrakruti : calculatePrakruti();
  const recommendations = dominantPrakruti !== 'Undetermined' ? getRecommendations(dominantPrakruti) : [];
  const displayData = selectedAssessment || formData;

  const renderCurrentStep = () => {
    const step = steps[currentStep];
    const field = step.field;
    const type = step.type;
    const error = errors[field];
    if (type === 'checkbox' || type === 'radio') {
      const isCheckbox = type === 'checkbox';
      const groupClass = isCheckbox ? 'checkbox-group' : 'radio-group';
      const inputType = isCheckbox ? 'checkbox' : 'radio';
      const checkedCondition = isCheckbox
        ? (option) => formData[field].includes(option)
        : (option) => formData[field] === option;
      const onChangeHandler = isCheckbox
        ? (e) => handleCheckboxChange(e, field)
        : (e) => handleRadioChange(e, field);
      const inputClass = isCheckbox ? 'form-checkbox' : 'form-radio';
      return (
        <div className="form-group">
          <div className={groupClass}>
            {step.options.map((option) => (
              <label key={option}>
                <input
                  type={inputType}
                  name={field}
                  value={option}
                  checked={checkedCondition(option)}
                  onChange={onChangeHandler}
                  className={inputClass}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {error && <span className="text-red-500">{error}</span>}
        </div>
      );
    } else if (type === 'textarea') {
      return (
        <div className="form-group">
          <textarea
            name={field}
            value={formData[field]}
            onChange={handleTextChange}
            placeholder={step.placeholder}
          />
          {error && <span className="text-red-500">{error}</span>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container">
      {errorMessage && (
        <div className="error-message bg-red-100 text-red-700 p-3 mb-4 rounded">
          {errorMessage}
        </div>
      )}
      {!showSummary ? (
        <div className="observation-form">
          <div className="step-indicator">
            <h2>Step {currentStep + 1} of {totalSteps}: {steps[currentStep].title}</h2>
          </div>
          <div className="current-step">{renderCurrentStep()}</div>
          <div className="button-group step-buttons">
            {currentStep > 0 && (
              <button type="button" className="prev-btn" onClick={handlePrev}>
                Previous
              </button>
            )}
            <button type="button" className="next-btn" onClick={handleNext}>
              {currentStep === totalSteps - 1 ? 'Submit' : 'Next'}
            </button>
            <button type="button" className="reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      ) : (
        <div ref={summaryRef} className="summary-table-container">
          <h2>Prakruti Analysis</h2>
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
      )}

      {assessments.length > 0 && (
        <div className="assessments-table-container">
          <h2>Past Assessments</h2>
          <table className="assessments-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Dominant Prakruti</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((assessment) => (
                <tr key={assessment._id}>
                  <td>{new Date(assessment.createdAt).toLocaleDateString()}</td>
                  <td>{assessment.dominantPrakruti}</td>
                  <td>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => fetchAssessmentById(assessment._id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ObservationForm;