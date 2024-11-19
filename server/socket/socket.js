require("dotenv").config();
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true, // Cho phép tất cả các miền
    methods: ["GET", "POST"], // Các phương thức HTTP được phép
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  // listen to a connection
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
  });


  io.emit("getOnlineUsers", onlineUsers);
  //Add send new message
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );
    console.log(message)
    if (user) {
      io.to(user?.socketId).emit("getMessage", message);
      io.to(user?.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date()
      });

    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
    console.log("user disconnected");
  });
});

module.exports = { app, io, server };
