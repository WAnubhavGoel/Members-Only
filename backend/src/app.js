import express from "express";
import passport from "./session-store/passport.js";
import { sessionMiddleware } from "./session-store/session.js";
const app=express();
app.use(sessionMidlleware);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(passport.session());
const PORT=3000||process.env.PORT;
app.listen(PORT,(error)=>{
    if(error){
        console.log(error);
    }
    console.log(`App running at ${PORT}`);
})