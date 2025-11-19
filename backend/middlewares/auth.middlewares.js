import User from "../models/auth.model.js"
import jwt from "jsonwebtoken"

export const protectedRoute = async(req,res,next)=>{
    try {
        // Expect Authorization header: "Bearer <token>"
        const authHeader = req.headers.authorization || req.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Unauthenticated user ." })
        }
        const token = authHeader.split(' ')[1];
        const isVerified = jwt.verify(token, process.env.SECRET_KEY)
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