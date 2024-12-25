import Chat from "../models/chat.model.js";
import Session from "../models/session.model.js"
import bcrypt from "bcrypt"
import { io , userSocketMap} from "../lib/socket.js";
export const getAllSessions = async(req,res)=>{
    try {
        const allSessions = await Session.find({});
        return res.status(200).json(allSessions);
    } catch (error) {
        console.log("error in getAllSessions route :",error);
        return res.status(500).json({message:"Internal server error . "})
    }
}
export const createSession = async(req,res)=>{
    const {name,password,language} = req.body;
    const creator = req.user;
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
            creator:creator._id,
            hostName:creator.username,
            password:hashedPass,
            name,
            language,
        });
        const chat = await Chat.create({
            sessionId:session._id
        })
        for (const userId in userSocketMap) {
            if(userId != creator._id){
                io.to(userSocketMap[userId]).emit("newSession",{session,chat})
                console.log(`Emitted newSession event to user: ${userId} , socketId ; ${userSocketMap[userId]}`);
            }
        }
        return res.status(201).json({session,chat});
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
        
        const isCorrectPassword = await bcrypt.compare(password,session.password);
        if(!isCorrectPassword) {
            return res.status(400).json({message:"Incorrect password ."})
        }
        const updatedSession = await Session.findByIdAndUpdate(
            sessionId,
            { 
                $addToSet: { participants: userId }, 
                $set: { new: true }                 
            },
            { new: true } 
        );
        const chat = await Chat.findOne({sessionId:sessionId})

        if (!updatedSession) {
            return res.status(400).json({ message: "Failed to update the session." });
        }
        return res.status(200).json({session:updatedSession,chat})
    } catch (error) {
        console.log("Error in joinSession : ",error)
        return res.status(500).json({message:"Internal server error ."})
    }
}
export const changeCode = async(req,res)=>{
    const {id : sessionId} = req.params;
    const {code } = req.body;
    const userId = req.user._id;

    try {
        const session = await Session.findById(sessionId);
        if(!session){
            return res.status(400).json({message:"Session doesn't found."})
        }
        const updatedSession = await Session.findByIdAndUpdate(
            sessionId,
            {
                $set:{code:code},
    
            },{new:true}
        )
        if(!updatedSession){
            return res.status(400).json({message:"Session doesn't updated ."})
        }
        return res.status(200).json(updatedSession);
    } catch (error) {
        console.log("Error in changeCode controller : ",error);
        return res.status(500).json({message:"Internal server error ."})
    }

}

