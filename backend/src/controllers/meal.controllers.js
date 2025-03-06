import express from "express";
import { Meal } from "../models/meal.model.js";

const router = express.Router();

router.put("/meal/:mealId/food/:foodId/consume", async (req, res) => {
  try {
    const { mealId, foodId } = req.params;
    const { isConsumed } = req.body; // User marks food as consumed or not

    const meal = await Meal.findOneAndUpdate(
      { _id: mealId, "dailyPlans.meals.foods._id": foodId },
      {
        $set: { "dailyPlans.$[].meals.$[].foods.$[food].isConsumed": isConsumed },
      },
      {
        arrayFilters: [{ "food._id": foodId }],
        new: true,
      }
    );

    if (!meal) return res.status(404).json({ message: "Meal or Food not found" });

    res.json({ message: "Food consumption status updated", meal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const getConsumedMeals = async (req, res) => {
    try {
      const userId = req.user._id; // Ensure authentication middleware sets req.user
  
      const consumedMeals = await Meal.aggregate([
        { $unwind: "$dailyPlans" },
        { $unwind: "$dailyPlans.meals" },
        { $unwind: "$dailyPlans.meals.foods" },
        { $match: { "dailyPlans.meals.foods.isConsumed": true } },
        {
          $group: {
            _id: userId,
            totalCalories: { $sum: "$dailyPlans.meals.foods.calories" },
            totalProtein: { $sum: "$dailyPlans.meals.foods.protein" },
            totalCarbs: { $sum: "$dailyPlans.meals.foods.carbs" },
            totalFats: { $sum: "$dailyPlans.meals.foods.fats" },
          },
        },
      ]);
  
      res.status(200).json({ success: true, data: consumedMeals });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };

export default router;
