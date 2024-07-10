import { Request, Response } from "express";
import { Socket } from "socket.io";

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
const cors = require("cors");

const corsOptions = {
  origin: "*",
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
const chunkSize = 5; // Example chunk size
io.on("connection", (socket: Socket) => {
  console.log("New client connected");

  socket.on("join-room", (room) => {
    socket.join(room);
    socket.broadcast.emit("room-joined", room);
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });

  socket.on("new-message", (data) => {
    io.emit("chat", data);
  });

  socket.on("offer", (data) => {
    socket.broadcast.emit("offer", data);
    console.log("offer", data);
  });

  socket.on("answer", (data) => {
    socket.broadcast.emit("answer", data);
    console.log("ans", data);
  });

  socket.on("candidate", (data) => {
    socket.broadcast.emit("candidate", data);
    console.log("candidate", data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
