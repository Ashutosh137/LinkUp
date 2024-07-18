import { Socket } from "socket.io";
import helmet from "helmet";
import conn from "./database/database";
import router from "./Routes/Route";
import morgen from "morgan";
import hpp from "hpp";
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

conn.then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
