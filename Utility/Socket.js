import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: ["http://localhost:5173","http://192.168.182.20:5173"] },
});

//used store online users
// object that contain key-value pair {userId:socketId}
const userSocketMap = {};

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection",(socket)=>{
    console.log("A user connected",socket.id);

    const userId = socket.handshake.query.userId;

    if(userId) userSocketMap[userId]=socket.id;

    //io.emit() is used to send events to all the connected clients
    // to broadcast online user
    io.emit("getOnlineUsers",Object.keys(userSocketMap)); // we can give any name to this broadcast means instend of getOnlineUser to onlineusers
    // just remeber that we have use this name when we want to access it in frontend 

    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });
})
export {io,app,server};