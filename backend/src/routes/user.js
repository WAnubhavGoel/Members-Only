import { Router } from "express";
import {joinClub} from "../controllers/userController.js";
const userRouter=Router();
userRouter.post("/join",isAuth,joinClub);
export {userRouter}