import passport from "passport"
export const isAuth=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.status(401).json({
            success:false,
            message:"Not authenticated"
        });
    }
}

export const isAdmin=(req,res,next)=>{
    if(req.isAuthenticated() && req.user.isAdmin){
        return next();
    }
    else{
        res.status(403).json({
            success:false,
            message:"Not admin"
        })
    }
}

export const isMember=(req,res,next)=>{
    if(req.isAuthenticated() && req.user.membership){
        return next();
    }
    else{
        res.status(403).json({
            success:false,
            message:"Not member"
        })
    }
}