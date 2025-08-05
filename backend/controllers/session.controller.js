import Chat from "../models/chat.model.js";
import Session from "../models/session.model.js"
import User from "../models/auth.model.js"
import bcrypt from "bcryptjs"
import { io , getSocketId , userSocketMap} from "../lib/socket.js";
export const getAllSessions = async(req,res)=>{
    try {
        const allSessions = await Session.find({});
        console.log("Sessions : ",allSessions);
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
                io.to(getSocketId(userId)).emit("newSession",{session,chat})
                console.log(`Emitted newSession event to user: ${userId} , socketId ; ${getSocketId(userId)}`);
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
        if(!password){
            return res.status(400).json({message :"Password is required."})
        }
        const session = await Session.findById(sessionId);
        if(!session){
            res.status(404).json({message:"Session not found ."});
        }
        const user = await User.findById(userId);
        if(!user){
            res.status(404).json({message:"User not found ."});
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
        for (const userId in userSocketMap) {
            io.to(getSocketId(userId)).emit("userJoinedSession",{session :updatedSession,chat,user})
            console.log(`Emitted userJoinedSession event to user: ${userId} , socketId ; ${getSocketId(userId)}`);
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
    const yeahId = req.user._id;

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
        for(const userId in userSocketMap ){
            if(updatedSession.participants.includes(userId) || updatedSession.creator == userId){
                io.to(getSocketId(userId)).emit("changeCode",{updatedSession,whoChanged : yeahId})
                console.log(`Emitted changeCode event to user: ${userId} , socketId ; ${getSocketId(userId)}`);
            }
        }
        return res.status(200).json(updatedSession);
        
    } catch (error) {
        console.log("Error in changeCode controller : ",error);
        return res.status(500).json({message:"Internal server error ."})
    }

}

export const endSession = async (req,res)=>{
    const {id : sessionId} = req.params;

    try {
        const isSession = await Session.findById(sessionId);
        console.log(isSession);
        if(!isSession){
            return res.status(400).json({message : "Session not found ."})
        }
        const participants = isSession.participants;
        const creator = isSession.creator
        await Session.findByIdAndDelete(sessionId);
        await Chat.findOneAndDelete({sessionId  })
        for(const userId in userSocketMap){
            io.to(getSocketId(userId)).emit("sessionEnded",{sessionId,participants,creator}) 
        }
        return res.status(200).json({message:"Session deleted ."})
    } catch (error) {
        console.log("Error in endSession : ",error)
        return res.status(500).json({message:"Internal server error ."})
    }
}
export const leaveSession = async (req,res)=>{
    const {userId} = req.body;
    const {id : sessionId} = req.params;
    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message : "User not found ."})

        }
        const isSession = await Session.findById(sessionId);
        if(!isSession){
            return res.status(404).json({message : "Session not found ."})
        }
        const result = await Session.updateOne(
            { _id: sessionId },
            { $pull: { participants: userId } }
        );
        for (const userId in userSocketMap) {
            io.to(getSocketId(userId)).emit("userLeftSession",{session :isSession,user})
            console.log(`Emitted userLeftSession event to user: ${userId} , socketId ; ${getSocketId(userId)}`);
        }
        return res.status(200).json({message:"Session left ."})
    } catch (error) {
        console.log("Error in joinSession : ",error)
        return res.status(500).json({message:"Internal server error ."})
        
    }
}