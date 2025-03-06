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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Meal Plan</h1>
            
            {dailyPlans.map((dayPlan) => (
                <div key={dayPlan._id} className="mb-12">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        {new Date(dayPlan.date).toLocaleDateString()}
                    </h2>
                    
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {dayPlan.meals.map((meal) => (
                            <div key={meal._id} className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">
                                    {meal.mealType}
                                </h3>
                                
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-600 mb-2">
                                        Foods:
                                    </h4>
                                    <ul className="space-y-2">
                                        {meal.foods.map((food) => (
                                            <li key={food._id} className="text-sm text-gray-700">
                                                <div className="flex justify-between">
                                                    <span>{food.name}</span>
                                                    <span>
                                                        {food.servingSize.amount}
                                                        {food.servingSize.unit}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {food.calories} kcal • 
                                                    P: {food.protein}g • 
                                                    C: {food.carbs}g • 
                                                    F: {food.fats}g
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-600 mb-2">
                                        Total Nutrients:
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="text-gray-700">Calories:</div>
                                        <div className="text-gray-900 font-medium">
                                            {meal.totalNutrients.calories}
                                        </div>
                                        <div className="text-gray-700">Protein:</div>
                                        <div className="text-gray-900 font-medium">
                                            {meal.totalNutrients.protein}g
                                        </div>
                                        <div className="text-gray-700">Carbs:</div>
                                        <div className="text-gray-900 font-medium">
                                            {meal.totalNutrients.carbs}g
                                        </div>
                                        <div className="text-gray-700">Fats:</div>
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
                <div className="text-center py-8 text-gray-500">
                    No meal plans available for the selected dates
                </div>
            )}
        </div>
    );
};

export default DietPlan;