import { Router } from "express";
const indexRouter=Router();
indexRouter.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"members Only API is running!"
    })
})
export {indexRouter}