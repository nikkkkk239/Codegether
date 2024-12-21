import jwt from "jsonwebtoken";

export const generateToken = (userId,res)=>{
    if(!userId) return;
    const encoded = jwt.sign({userId},process.env.SECRET_KEY,{
        expiresIn:"7d",
    })
    res.cookie("token",encoded,{
        maxAge:3*24*60*60,
        httpOnly:true,
        sameSite:"strict",
    })
}