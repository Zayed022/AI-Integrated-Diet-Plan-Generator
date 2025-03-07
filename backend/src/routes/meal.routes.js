import express from "express";
import { getConsumedMeals,
    saveLatestDietPlan,
    markFoodAsConsumed,
    getLatestDietPlan,
    deleteDietPlan,
 } from "../controllers/meal.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; // Ensure authentication

const router = express.Router();

router.get("/consumed-meals", verifyJWT, getConsumedMeals); 
// Protect route
router.post("/save-latest", verifyJWT, saveLatestDietPlan);

// 2️⃣ Mark a food item as consumed
router.post("/mark-consumed", verifyJWT, markFoodAsConsumed);

// 3️⃣ Get the latest diet plan
router.get("/latest-diet", verifyJWT, getLatestDietPlan);

// 4️⃣ Delete the latest diet plan
router.delete("/delete-latest", verifyJWT, deleteDietPlan);

export default router;
