import { Router } from "express";
import {prisma} from "../../prisma/prisma.js";
import {postMessage,getMessages,deleteMessages} from "../controllers/messageController.js";
import {isAuth,isAdmin} from "../authMiddleware/authMiddleware.js"
const messageRouter=Router();
messageRouter.post("/new",isAuth,postMessage);
messageRouter.get("/",getMessages);
messageRouter.get("/delete/:id",isAdmin,deleteMessages);
export {messageRouter}