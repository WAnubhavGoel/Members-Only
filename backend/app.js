import express from "express";
import cors from "cors";
import passport from "./src/session-store/passport.js";
import { sessionMiddleware } from "./src/session-store/session.js";
import { indexRouter } from "./src/routes/index.js";
import { userRouter } from "./src/routes/user.js";
import { messageRouter } from "./src/routes/message.js";
import { authRouter } from "./src/routes/auth.js";

const app=express();

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}))

app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(passport.session());
app.use("/api",indexRouter);
app.use("/api/auth",authRouter);
app.use("/api/users",userRouter);
app.use("/api/messages",messageRouter);

const PORT=process.env.PORT||3000;

app.listen(PORT,(error)=>{
    if(error){
        console.log(error);
    }
    console.log(`App running at ${PORT}`);
})