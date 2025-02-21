import {Router} from "express"
import {
    registerUser,
    loginUser,
    logoutUser,
    generateUserPreference
} from "../controllers/user.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/details").post(verifyJWT,generateUserPreference)

export default router;