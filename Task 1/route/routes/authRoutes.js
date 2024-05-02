import {Router} from "express";
import controllers from "../../controller/index.js"


const router = Router();


router.post("/api/v1/auth/signup", controllers.authControllers.signUpController);
router.post("/api/v1/auth/login", controllers.authControllers.loginController);
router.get("/api/v1/auth/forgotPassword", controllers.authControllers.otpGeneratingController);
router.post("/api/v1/auth/forgotPassword/verify", controllers.authControllers.forgotPasswordController);

export default router;