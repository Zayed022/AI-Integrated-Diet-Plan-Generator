import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AdvancedPreferencesForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    season: '',
    location: '',
    foodAllergies: '',
    mealTiming: '',
    cuisinePreference: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const storedUserId = localStorage.getItem("userId");

  const seasonOptions = ['Summer', 'Winter', 'Monsoon', 'All Seasons'];
  const mealTimingOptions = ['Early Morning', 'Morning', 'Afternoon', 'Evening', 'Night'];
  const cuisineOptions = ['Indian', 'Mediterranean', 'Asian', 'Continental', 'Keto', 'Paleo'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!storedUserId) {
      setError("User session expired. Please login again.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        '/api/v1/users/advanced-preferences',
        {
          ...formData,
          userId: storedUserId
        },
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data.success) {
        navigate('/personalized-diet');
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
      <h2 className="text-2xl font-bold mb-6">Advanced Diet Preferences</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Season</label>
            <select
              name="season"
              value={formData.season}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              {seasonOptions.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="Enter your city or region"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Food Allergies</label>
            <input
              type="text"
              name="foodAllergies"
              value={formData.foodAllergies}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="E.g., Nuts, Dairy, Gluten"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Meal Timing</label>
            <select
              name="mealTiming"
              value={formData.mealTiming}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              {mealTimingOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cuisine Preference</label>
            <select
              name="cuisinePreference"
              value={formData.cuisinePreference}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              {cuisineOptions.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Saving Preferences...' : 'Save Preferences'}
        </button>
      </form>
    </div>
  );
};
