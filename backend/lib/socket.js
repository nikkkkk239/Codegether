// import {Server} from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();

// const server = http.createServer(app);

// const io = new Server(server,{
//     cors:{
//         origin:["http://localhost:5173"],
//     }
// })
// export function getSocketId(userId){
//     return userSocketMap[userId];
// }
// export const userSocketMap = {};
// io.on("connection",(socket)=>{
//     console.log("user connected - ",socket.id);
//     const userId = socket.handshake.query.userId;
//     if(userId) userSocketMap[userId] = socket.id;

//     io.emit("getOnlineUsers",Object.keys(userSocketMap));
//     console.log("Online Users ",Object.keys(userSocketMap));

//     socket.on("disconnect",()=>{
//         console.log("A user disconnected , ",socket.id)

//         if (userId && userSocketMap[userId]) {
//             delete userSocketMap[userId];
//         }
//         io.emit('getOnlineUsers',Object.keys(userSocketMap));
//         console.log("Online Users ",Object.keys(userSocketMap));
//     })
// })
// export {app,server,io};





import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv"
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL]
    },
});

export const userSocketMap = {};

export function getSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("User connected - ", socket.id);
    
    const userId = socket.handshake.query.userId;
    if (userId && typeof userId === "string" && userId.trim() !== "") {
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log("Online Users ", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected, ", socket.id);

        if (userId && userSocketMap[userId]) {
            delete userSocketMap[userId];
        }

        console.log("Online Users ", Object.keys(userSocketMap));
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, server, io };
