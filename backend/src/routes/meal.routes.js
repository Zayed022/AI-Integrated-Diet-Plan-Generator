import express from "express";
import { getConsumedMeals } from "../controllers/meal.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; // Ensure authentication

const router = express.Router();

router.get("/consumed-meals", verifyJWT, getConsumedMeals); // Protect route

export default router;
