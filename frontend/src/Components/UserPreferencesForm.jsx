import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const UserPreferencesForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    activityLevels: "",
    preference: "",
    gender: "",
    goals: "",
    workType: "",
    medicalConditions: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activityLevelsOptions = ["Low", "Moderate", "High"];
  const preferenceOptions = ["Vegan", "Vegetarian", "Non-Vegetarian"];
  const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];
  const goalsOptions = ["Weight loss", "Weight gain", "Muscle Building"];
  const workTypeOptions = ["Sedentary", "Moderate", "Heavy"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/v1/users/details",
        {
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        navigate("/diet-plan");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-gradient-to-r from-green-50 to-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
        🌿 Personalize Your Diet Plan
      </h2>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Age", name: "age", type: "number" },
            { label: "Weight (kg)", name: "weight", type: "number" },
            { label: "Height (cm)", name: "height", type: "number" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-700">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-400 p-3"
                required
              />
            </div>
          ))}

          {[
            { label: "Gender", name: "gender", options: genderOptions },
            { label: "Activity Level", name: "activityLevels", options: activityLevelsOptions },
            { label: "Dietary Preference", name: "preference", options: preferenceOptions },
            { label: "Health Goals", name: "goals", options: goalsOptions },
            { label: "Work Type", name: "workType", options: workTypeOptions },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-700">
                {field.label}
              </label>
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-400 p-3"
              >
                <option value="" disabled>
                  Select an option
                </option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700">
              Medical Conditions
            </label>
            <input
              type="text"
              name="medicalConditions"
              value={formData.medicalConditions}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-400 p-3"
              placeholder="e.g., Diabetes, Hypertension"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-green-700 transition-all duration-300 disabled:bg-gray-400"
        >
          {loading ? "Saving Preferences..." : "Generate My Plan"}
        </button>
      </form>
    </div>
  );
};
