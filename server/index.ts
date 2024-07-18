import { Socket } from "socket.io";
import helmet from "helmet";
import conn from "./database/database";
import router from "./Routes/Route";
import morgen from "morgan";
import hpp from "hpp";
import Createroom from "./utilities/create-room";
const compression = require("compression");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const sanitize = require("express-mongo-sanitize");
const app = express();
const server = http.createServer(app);
const cookieParser = require("cookie-parser");

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(sanitize());
app.use(morgen("dev"));
app.use(hpp());
app.use(cookieParser());

app.use("/", router);

io.on("connection", (socket: Socket) => {
  console.log("New client connected", socket.id);

  socket.on("join-room", ({ room }) => {
    socket.join(room);
    socket.emit("room-joined", { room });
  });
  socket.on("create-room", async ({ name = "aashutosh" }) => {
    const RoomName = Createroom();
    socket.join(RoomName);
    socket.emit("room-created", { RoomName, name });
  });
  socket.on("req-join", ({ RoomName, name }) => {
    socket.join(RoomName);
    socket.to(RoomName).emit("req-join", { RoomName, name });
  });

  socket.on("Join-req-accepted", ({ RoomName, name = "aashutosh" }) => {
    socket.to(RoomName).emit("join-req-accepted", { RoomName, name });
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });

  socket.on("new-message", ({ room, message }) => {
    console.log(message, room);
    io.to(room).emit("chat", message);
  });

  socket.on("offer", ({ room, offer }) => {
    console.log(offer,room)
    socket.to(room).emit("offer", offer);
  });
  socket.on("user-disconnect", ({ room, name }) => {
    socket.to(room).emit("user disconnected", name);
  });

  socket.on("answer", ({ room, answer }) => {
    socket.to(room).emit("answer", answer);
  });

  socket.on("candidate", (data) => {
    socket.emit("candidate", data);
  });
});

const PORT = process.env.PORT || 3000;

conn.then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
