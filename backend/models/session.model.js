import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true,
    },
    language:{
        type:String,
        required:true,
    },
    code:{
        type:String,
        default:"",
    },
    participants :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }],default:[],
    password:{
        type:String,
        minlength:6,
        required:true,
    }
})
const Session = mongoose.model("sessions",sessionSchema);
export default Session;