import User from "../models/auth.model.js"
import jwt from "jsonwebtoken"

export const protectedRoute = async(req,res,next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthenticated user ."})
        }
        const isVerified = jwt.verify(token,process.env.SECRET_KEY)
        if(!isVerified){
            return res.status(401).json({message:"Unauthenticated user ."})
        }
        const isUser = await User.findById(isVerified.userId);
        if(!isUser){
            return res.status(401).json({message:"Unauthenticated user ."})
        }
        req.user = isUser;
        next();
    } catch (error) {
        console.log("Error in protected route : ",error)
        return res.status(500).json({message:"Internal server error ."})
    }
}