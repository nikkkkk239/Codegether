import Chat from "../models/chat.model.js";
import Session from "../models/session.model.js";
import { io,userSocketMap,getSocketId } from "../lib/socket.js";
export const sendMessage = async(req,res)=>{
    const {id : chatId} = req.params;
    const {text} = req.body;
    const senderId = req.user._id;
    try {
        const chat = await Chat.findById(chatId);
        const session = await Session.findById(chat.sessionId);

        if(!chat){
            return res.status(404).json({message:"Chat doesn't found . "})
        }
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push:{
                    messages:{text,senderId,time:new Date()}
                }
            },{new:true}
        );
        for(const userId in userSocketMap){
            if(session.participants.includes(userId) || session.creator == userId){
                io.to(getSocketId(userId)).emit("newMessage",{session,newMessage:{text,senderId,time:new Date()}}) 
            }
        }

        return res.status(200).json({chat : updatedChat,newMessage:{text,senderId,time:new Date()}})

    } catch (error) {
        console.log("error in sendMessage controller : ",error);
        return res.status(500).json({message:"Internal server error ."})
        
    }
}