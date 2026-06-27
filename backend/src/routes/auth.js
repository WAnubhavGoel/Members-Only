import { Router } from "express";
import passport from "passport";
import { 
  signUpUser, 
  loginUser, 
  checkAuthStatus, 
  logoutUser 
} from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/sign-up", signUpUser);
authRouter.post("/login", loginUser);
authRouter.get("/status", checkAuthStatus);
authRouter.post("/logout", logoutUser);

export { authRouter };
