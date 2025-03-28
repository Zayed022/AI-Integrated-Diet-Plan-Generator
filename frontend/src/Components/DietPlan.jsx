import { useEffect, useState } from "react";
import axios from "axios";

const DietPlan = () => {
  const [dailyPlans, setDailyPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({});

  const [consumedFoods, setConsumedFoods] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "/api/v1/recommendation/recommend",
          {
            userId: "67cc9ac071d7000ecdd047f5",
            startDate: "2025-03-13",
            endDate: "2025-03-14",
          },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data && response.data.dailyPlans) {
          setDailyPlans(response.data.dailyPlans);
          // Initialize consumed foods state
          const initialConsumed = {};
          response.data.dailyPlans.forEach((dayPlan) => {
            dayPlan.meals.forEach((meal) => {
              meal.foods.forEach((food) => {
                initialConsumed[food._id] = food.consumed || false;
              });
            });
          });
          setConsumedFoods(initialConsumed);
        } else {
          setError("No meal plans available");
        }
      } catch (error) {
        console.log("Error fetching meals:", error);
        setError("Failed to load meal plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFoodConsumption = async (foodId, mealId, isConsumed) => {
    try {
        setConsumedFoods(prev => ({
            ...prev,
            [foodId]: isConsumed
        }));

        // Reset rating when food is unmarked as consumed
        if (!isConsumed) {
            setRatings(prev => {
                const updatedRatings = { ...prev };
                delete updatedRatings[foodId];
                return updatedRatings;
            });
        }

        await axios.post(
            "/api/v1/meal/mark-consumed",
            {
                foodId,
                mealId,
                consumed: isConsumed,
                userId: "67cc9ac071d7000ecdd047f5"
            },
            { headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error updating consumption:", error);
        setConsumedFoods(prev => ({
            ...prev,
            [foodId]: !isConsumed
        }));
    }
};

  const handleRatingSubmit = async (foodId, mealId, rating) => {
    try {
        setRatings(prev => ({
            ...prev,
            [foodId]: rating
        }));

        await axios.post(
            "/api/v1/feedback/submit-rating",
            {
                foodId,
                mealId,
                rating,
                userId: "67cc9ac071d7000ecdd047f5"
            },
            { headers: { "Content-Type": "application/json" } }
        );

        console.log("Rating submitted successfully!");
    } catch (error) {
        console.error("Error submitting rating:", error);
    }
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg max-w-2xl mx-auto mt-8">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-10 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
          🍽️ Your Personalized Meal Plan
        </h1>

        {dailyPlans.map((dayPlan) => (
          <div key={dayPlan._id} className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2 text-center">
              📅 {new Date(dayPlan.date).toLocaleDateString()}
            </h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {dayPlan.meals.map((meal) => (
                <div
                  key={meal._id}
                  className="rounded-xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                    🍽️ {meal.mealType}
                  </h3>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">
                      🥗 Foods:
                    </h4>
                    <ul className="space-y-3">
                      {meal.foods.map((food) => (
                        <li
                          key={food._id}
                          className={`text-sm text-gray-800 bg-white/90 p-3 rounded-lg shadow-md ${
                            consumedFoods[food._id]
                              ? "border-l-4 border-green-500"
                              : ""
                          }`}
                        >
                          <div className=" items-start">
                            

                            <div className="ml-3 flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium">{food.name}</span>
                                <span className="text-gray-500 text-sm">
                                  {food.servingSize.amount}
                                  {food.servingSize.unit}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                🔥 {food.calories} kcal • 💪 P: {food.protein}g
                                • 🍞 C: {food.carbs}g • 🥑 F: {food.fats}g
                              </div>
                            </div>

                            <div>
                              <input
                                type="checkbox"
                                checked={consumedFoods[food._id] || false}
                                onChange={(e) =>
                                  handleFoodConsumption(
                                    food._id,
                                    meal._id,
                                    e.target.checked
                                  )
                                }
                                className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                              />
                              <label className="text-green-500"> Consumed?</label>

                              {consumedFoods[food._id] && (
                                <div className="mt-2">
                                  <label>Rate this food:</label>
                                  <select
                                    value={ratings[food._id] || ""}
                                    onChange={(e) =>
                                      handleRatingSubmit(
                                        food._id,
                                        meal._id,
                                        Number(e.target.value)
                                      )
                                    }
                                    className="ml-2 border p-1 rounded"
                                  >
                                    <option value="">Select</option>
                                    <option value="1">⭐ (1)</option>
                                    <option value="2">⭐⭐ (2)</option>
                                    <option value="3">⭐⭐⭐ (3)</option>
                                    <option value="4">⭐⭐⭐⭐ (4)</option>
                                    <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                                  </select>
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-300 mt-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">
                      📊 Total Nutrients:
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-gray-700">🔥 Calories:</div>
                      <div className="text-gray-900 font-medium">
                        {meal.totalNutrients.calories}
                      </div>
                      <div className="text-gray-700">💪 Protein:</div>
                      <div className="text-gray-900 font-medium">
                        {meal.totalNutrients.protein}g
                      </div>
                      <div className="text-gray-700">🍞 Carbs:</div>
                      <div className="text-gray-900 font-medium">
                        {meal.totalNutrients.carbs}g
                      </div>
                      <div className="text-gray-700">🥑 Fats:</div>
                      <div className="text-gray-900 font-medium">
                        {meal.totalNutrients.fats}g
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {dailyPlans.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500 text-lg">
            🚫 No meal plans available for the selected dates.
          </div>
        )}
      </div>
    </div>
  );
};

export default DietPlan;
