import express from "express";
import passport from "./session-store/passport.js";
import { sessionMiddleware } from "./session-store/session.js";
import { indexRouter } from "./routes/index.js";
import { userRouter } from "./routes/user.js";
import { messageRouter } from "./routes/message.js";
import { authRouter } from "./routes/auth.js";

const app=express();

app.use(sessionMidlleware);
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(passport.session());
app.use("/api",indexRouter);
app.use("/api/auth",authRouter);
app.use("/api/users",userRouter);
app.use("/api/messages",messageRouter);

const PORT=3000||process.env.PORT;

app.listen(PORT,(error)=>{
    if(error){
        console.log(error);
    }
    console.log(`App running at ${PORT}`);
})