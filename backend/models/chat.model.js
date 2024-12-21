import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    sessionId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "sessions",
    },
    messages:[
        {
            senderId : {type:mongoose.Schema.Types.ObjectId,
                ref : "users",
                required:true
            },            
            text:{type:String,
                required:true
            },
            time:{
                type: Date, 
                default: Date.now, 
            },
        }
    ]
},{timestamps:true})
const Chat = mongoose.model("chats",chatSchema);
export default Chat;