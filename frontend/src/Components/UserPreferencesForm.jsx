import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const UserPreferencesForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    activityLevels: '',
    preference: '',
    gender: '',
    goals: '',
    workType: '',
    medicalConditions: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const storedUserId = localStorage.getItem("userId");

  const activityLevelsOptions = [
    'sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extra-active'
  ];

  const preferenceOptions = [
   "Vegan","Vegetarian","Non-Vegetarian"
  ]

  const genderOptions = [
    "Male","Female","Non-binary","Prefer not to say"
  ]

  const goalsOptions = [
    "Weight loss","Weight gain","Muscle Building"
  ]

  const workTypeOptions = [
    "Sedentary","Moderate","Heavy"
  ]



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!storedUserId) {
      setError("User session expired. Please login again.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        '/api/v1/users/details',
        {
          ...formData,
          userId: storedUserId // Add userId to the request body
        },
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data.success) {
        navigate('/diet-plan');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Tell Us About Yourself</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Activity Level</label>
            <select
              name="activityLevels"
              value={formData.activityLevels}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              {activityLevelsOptions.map(level => (
                <option key={level} value={level}>{level.replace('-', ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Dietary Preference</label>
            <select
              name="preference"
              value={formData.preference}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
                
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Health Goals</label>
            <select
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="weight-loss">Weight Loss</option>
              <option value="muscle-gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
            <input
              type="text"
              name="medicalConditions"
              value={formData.medicalConditions}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="Diabetes, Hypertension, etc."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Saving Preferences...' : 'Generate My Plan'}
        </button>
      </form>
    </div>
  );
};