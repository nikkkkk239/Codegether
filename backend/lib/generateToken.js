import jwt from "jsonwebtoken";

export const generateToken = (userId,res)=>{
    if(!userId) return;
    const encoded = jwt.sign({userId},process.env.SECRET_KEY,{
        expiresIn:"15d",
    })
    res.cookie("token",encoded,{
        maxAge:15*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
    })
}