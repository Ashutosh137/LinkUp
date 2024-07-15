import { Request, Response } from "express";
import { Socket } from "socket.io";

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://linkup-dev.vercel.app/",
  },
});
const cors = require("cors");

const corsOptions = {
  origin: "https://linkup-dev.vercel.app/",
  credentials: true,
};

app.use(cors(corsOptions));

// Serve the socket.io client library (optional)
// app.use(
//   "/socket.io",
//   express.static(__dirname + "/node_modules/socket.io/client-dist")
// );
app.get("/", (req: Request, res: Response) => {
  res.send("server");
});

io.on("connection", (socket: Socket) => {
  console.log("New client connected", socket.id);

  // socket.on("join-room", ({ RoomName, UserName }) => {
  //   socket.join(RoomName);
  //   socket.emit("room-joined", { RoomName, UserName });
  // });
  socket.on("create-room", ({ RoomName, UserName = "aashutosh" }) => {
    socket.join(RoomName);
    socket.emit("room-created", { RoomName, UserName });
  });

  socket.on("Join-req-accepted", ({ RoomName, UserName = "aashutosh" }) => {
    socket.to(RoomName).emit("join-req-accepted", { RoomName, UserName });
  });
  socket.on("req-join", ({ RoomName, UserName }) => {
    socket.join(RoomName);
    socket.to(RoomName).emit("req-join", { RoomName, UserName });
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });

  socket.on("new-message", ({ room, message }) => {
    io.to(room).emit("chat", message);
  });

  socket.on("offer", ({ room, offer }) => {
    socket.to(room).emit("offer", offer);
  });
  socket.on("user-disconnect", ({ room, UserName }) => {
    socket.to(room).emit("user disconnected", UserName);
  });

  socket.on("answer", ({ room, answer }) => {
    socket.to(room).emit("answer", answer);
  });

  socket.on("candidate", (data) => {
    socket.emit("candidate", data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
