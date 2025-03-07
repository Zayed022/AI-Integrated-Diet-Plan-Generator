import { useEffect, useState } from "react";
import axios from "axios";

const DietPlan = () => {
    const [dailyPlans, setDailyPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.post(
                    "/api/v1/recommendation/recommend",
                    {
                        userId: "678140b0d84a94f1640c2077",
                        startDate: "2025-03-11",
                        endDate: "2025-03-12"
                    },
                    { headers: { "Content-Type": "application/json" } }
                );

                if (response.data && response.data.dailyPlans) {
                    setDailyPlans(response.data.dailyPlans);
                } else {
                    setError("No meal plans available");
                }
            } catch (error) {
                console.error("Error fetching meals:", error);
                setError("Failed to load meal plans. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                                                    className="text-sm text-gray-800 bg-white/90 p-3 rounded-lg shadow-md"
                                                >
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">{food.name}</span>
                                                        <span className="text-gray-500 text-sm">
                                                            {food.servingSize.amount}{food.servingSize.unit}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        🔥 {food.calories} kcal • 
                                                        💪 P: {food.protein}g • 
                                                        🍞 C: {food.carbs}g • 
                                                        🥑 F: {food.fats}g
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