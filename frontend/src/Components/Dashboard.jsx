import React, { useState } from "react";

const Dashboard = ({ mealPlan }) => {
  const [consumedNutrients, setConsumedNutrients] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  const handleCheckboxChange = (foodItem, isChecked) => {
    setConsumedNutrients((prev) => ({
      calories: isChecked ? prev.calories + foodItem.calories : prev.calories - foodItem.calories,
      protein: isChecked ? prev.protein + foodItem.protein : prev.protein - foodItem.protein,
      carbs: isChecked ? prev.carbs + foodItem.carbs : prev.carbs - foodItem.carbs,
      fats: isChecked ? prev.fats + foodItem.fats : prev.fats - foodItem.fats,
    }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Total Consumed Nutrients</h2>
        <p>🔥 Calories: {consumedNutrients.calories} kcal</p>
        <p>💪 Protein: {consumedNutrients.protein} g</p>
        <p>🍞 Carbs: {consumedNutrients.carbs} g</p>
        <p>🥑 Fats: {consumedNutrients.fats} g</p>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Meal Plan</h2>
        {mealPlan.map((meal, index) => (
          <div key={index} className="mb-6 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-bold">🍽️ {meal.name}</h3>
            {meal.foods.map((food, i) => (
              <div key={i} className="flex items-center justify-between border-b py-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    onChange={(e) => handleCheckboxChange(food, e.target.checked)}
                  />
                  {food.name} ({food.calories} kcal, {food.protein}g P, {food.carbs}g C, {food.fats}g F)
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
