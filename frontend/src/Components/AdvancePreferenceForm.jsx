import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AdvancedPreferencesForm = () => {
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

  const activityLevelsOptions = ["Low", "Moderate", "High"];
  const preferenceOptions = ["Vegan", "Vegetarian", "Non-Vegetarian"];
  const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];
  const goalsOptions = ["Weight loss", "Weight gain", "Muscle Building"];
  const workTypeOptions = ["Sedentary", "Moderate", "Heavy"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/v1/users/details', formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) navigate('/advance-diet-plan');
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
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-green-100 to-green-200 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-6">Personalize Your Diet Plan based on Season</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['age', 'weight', 'height', 'medicalConditions'].map((field, index) => (
            <div key={index}>
              <label className="block text-lg font-semibold text-gray-700">{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
              <input
                type={field === 'age' || field === 'weight' || field === 'height' ? 'number' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-md px-4 py-2 text-gray-700 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-400"
                required={field !== 'medicalConditions'}
                placeholder={field === 'medicalConditions' ? 'Diabetes, Hypertension, etc.' : ''}
              />
            </div>
          ))}
          {[['gender', genderOptions], ['activityLevels', activityLevelsOptions], ['preference', preferenceOptions], ['goals', goalsOptions], ['workType', workTypeOptions]].map(([name, options], index) => (
            <div key={index}>
              <label className="block text-lg font-semibold text-gray-700">{name.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
              <select
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-md px-4 py-2 text-gray-700 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-400"
                required
              >
                <option value="">Select {name}</option>
                {options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-400"
        >
          {loading ? 'Saving Preferences...' : 'Generate My Plan'}
        </button>
      </form>
    </div>
  );
};
