import Session from "../models/session.model.js"
import bcrypt from "bcrypt"
export const getAllSessions = async(req,res)=>{
    try {
        const allSessions = await Session.find({});
        return res.status(200).json(allSessions);
    } catch (error) {
        console.log("error in getAllSessions route :",error);
        return res.status(500).json({message:"Internal server error . "})
    }
}
///use select in auth
export const createSession = async(req,res)=>{
    const {name,password,language} = req.body;
    const creatorId = req.user._id;
    try {
        if(!name || !password || !language){
            return res.status(400).json({message:"Incomplete data provided ."})
        }
        if(password.length < 6){
            return res.status(400).json({message:"Password length must be at least 6 ."})
        }
        const isSession = await Session.findOne({name})
        if(isSession){
            return res.status(400).json({message:"Session name is not available ."})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password,salt);
        const session = await Session.create({
            creator:creatorId,
            password:hashedPass,
            name,
            language,
        });
        return res.status(201).json(session);
    } catch (error) {
        console.log("Error in createSession : ",error)
        return res.status(500).json({message:"Internal server error."})
    }
}
export const joinSession = async(req,res)=>{
    const {id : sessionId} = req.params;
    const {password} = req.body;
    const userId = req.user._id;

    try {
        const session = await Session.findById(sessionId);
        if(!session){
            res.status(404).json({message:"Session not found ."});
        }
        //want to update session participant list.
        const isCorrectPassword = await bcrypt.compare(password,session.password);
        if(!isCorrectPassword) {
            return res.status(400).json({message:"Incorrect password ."})
        }
        return res.status(200).json(session)
    } catch (error) {
        console.log("Error in getSessiondetails : ",error)
        return res.status(500).json({message:"Internal server error ."})
    }
}
