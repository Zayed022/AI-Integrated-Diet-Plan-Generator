import {Router} from "express"

import { submitFeedback } from "../controllers/feedback.controllers.js"
import { submitFoodFeedback } from "../controllers/recommendation.controllers.js";
const router = Router();

router.post("/submit",submitFeedback)

router.post("/submit-feedback-fooditem",submitFoodFeedback)



export default router