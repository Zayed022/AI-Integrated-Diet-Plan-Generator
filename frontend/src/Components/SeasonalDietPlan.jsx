import React, { useEffect, useState } from "react";
import axios from "axios";

const SeasonalDietPlan = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "/api/v1/recommendation/advanced-recommendations",
          {
            userId: "67cc9ac071d7000ecdd047f5",
            type: "Seasonal",
          },
          { headers: { "Content-Type": "application/json" } }
        );
        setRecommendations(response.data.recommendations);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return <p className="text-center text-xl text-blue-400 font-semibold animate-pulse">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500 text-lg font-semibold">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col items-center px-6 py-10">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent text-center">
        🍃 Seasonal Diet Plan Recommendations
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {recommendations.map((food) => (
          <div
            key={food._id}
            className="relative bg-white/30 backdrop-blur-lg border border-white/40 shadow-lg rounded-3xl overflow-hidden p-6 transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            {/* Glow Effect */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-green-300 opacity-50 blur-xl rounded-full"></div>
            <div className="absolute top-10 right-10 w-16 h-16 bg-blue-300 opacity-50 blur-xl rounded-full"></div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">{food.name}</h3>
            <p className="text-gray-700 text-lg"><strong>🔥 Calories:</strong> {food.calories} kcal</p>
            <p className="text-gray-700 text-lg"><strong>💪 Protein:</strong> {food.protein}g</p>
            <p className="text-gray-700 text-lg"><strong>🍞 Carbs:</strong> {food.carbs}g</p>
            <p className="text-gray-700 text-lg"><strong>🛢️ Fats:</strong> {food.fats}g</p>
            <p className="text-gray-700 text-lg">
              <strong>🍽️ Serving Size:</strong> {food.servingSize.amount} {food.servingSize.unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonalDietPlan;
