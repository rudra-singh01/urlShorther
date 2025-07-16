import express from "express";
import { signupController, loginController , logOutController , get_current_user_controller} from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout' , logOutController)
router.get("/me" , authMiddleware ,get_current_user_controller)

export default router;