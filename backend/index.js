import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv"
import { connectDb } from "./lib/db.js";
import authRouter from "./routes/auth.route.js" 
import sessionRouter from "./routes/session.route.js"
import chatRouter from "./routes/chat.route.js"
import { server,io,app } from "./lib/socket.js";
import path from "path"

const __dirname = path.resolve();
const PORT = process.env.PORT || 3001;
dotenv.config();
app.use(cors({
   origin:"http://localhost:5173",
   credentials:true, 
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.use("/api/auth",authRouter)
app.use("/api/session",sessionRouter)
app.use("/api/chat",chatRouter)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname , "../frontend/dist")))

    app.get("*" ,(req,res)=>{
        res.sendFile(path.join(__dirname , "../frontend" , "dist","index.html"));
    })
}

server.listen(PORT,()=>{
    console.log(`Server started at : ${PORT}`);
    connectDb();
});

