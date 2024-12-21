import mongoose from "mongoose";

export const connectDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongodb database connected .")
    } catch (error) {
        console.log("Error occured while connecting mongodb database : ",error);
    }
}