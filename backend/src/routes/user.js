import { Router } from "express";
import {joinClub} from "../controllers/userController.js";
import { isAuth } from "../authMiddleware/authMiddleware.js";
const userRouter=Router();
userRouter.post("/join",isAuth,joinClub);
export {userRouter}