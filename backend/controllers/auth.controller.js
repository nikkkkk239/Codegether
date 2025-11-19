import { generateToken } from "../lib/generateToken.js";
import User from "../models/auth.model.js";
import cloudinary from "../lib/cloudinary.js"
import bcrypt from "bcryptjs"
export const login = async (req,res)=>{
    const {email,password}  = req.body;
    try {
        if(!email || !password){
            return res.status(400).json({message:"Complete data is required ."})
        }
        const isUser = await User.findOne({email});
        if(!isUser){
            return res.status(404).json({message:"No user found ."})
        }
        const isPasswordCorrect = await bcrypt.compare(password,isUser.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message : "Incorrect password ."})
        }
        generateToken(isUser._id,res);
        return res.status(200).json(isUser);
    } catch (error) {
        console.log("Error in login route : ",error)
        return res.status(500).json({message:"Internal server error ."})
    }
}
export const register = async(req,res)=>{
    let {username,email,password,profilePic} = req.body;
    //add default profile pic...;
    if(!profilePic){
        profilePic = "";
    }
    else{
        const response = await cloudinary.uploader.upload(profilePic);
        profilePic = response.secure_url;
    }
    try {
        if(!username || !email || !password){
            return res.status(400).json({message:"Incomplete data recieved ."})
        }
        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least of length 6 ."})
        }
        const isUser = await User.findOne({email});
        if(isUser){
            return res.status(400).json({message:"Email already in use ."})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
    
        const user = await User.create({
            username,
            email,
            password : hashedPassword
        })
    
        if(!user){
            return res.status(500).json({message:"Internal server error."}) 
        }
        generateToken(user._id,res);
        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in register route : ",error)
        return res.status(500).json({message:"Internal server error ."})
    }
}
export const logout = async (req,res)=>{
    try {
        res.cookie('token',"",{ httpOnly: true,secure: true,
        sameSite: "None",
        expires: new Date(0)})
        return res.status(200).json({message:"Logged out successful ."})
    } catch (error) {
        console.log("Error in logout route : ",error)
        return res.status(500).json({message:"Internal server error ."})
    }
}
export const checkAuth = async (req,res)=>{
    try {
        const user = req.user;
        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in check auth route : ",error)
        return res.status(500).json({message:"Internal server error ."})
    }
}
export const getUser = async (req,res)=>{
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        console.log(user);
        if(!user){
            return res.status(404).json({message:"User not found ."});
        }
        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in check auth route : ",error)
        return res.status(500).json({message:"Internal server error ."})
    }
}