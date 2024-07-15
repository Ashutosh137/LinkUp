import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Video from "./components/videocall";
import socket from "./socket";
import Navbar from "./layout/navbar";
import TextField from '@mui/material/TextField'
import { Box, Button, Stack, Typography } from "@mui/material";


export default function App() {
  const [RoomName, setRoomName] = useState("")
  const [IsInRoom, setIsInRoom] = useState("")

  const [UserName, setUserName] = useState("")

  const [roomJoinReq, setroomJoinReq] = useState(false)
  const [load, setload] = useState(true)

  const [roomjoinreqdata, setroomjoinreqdata] = useState({ UserName, RoomName })


  useEffect(() => {
    socket.on("connect", () => { setload(false) })
    socket.on('room-joined', ({ RoomName, UserName }: { RoomName: string; UserName: string }) => {
      toast.success(`${UserName} joined in room ${RoomName}❤️ room joined`)
      setIsInRoom(RoomName)
    })
    socket.on('room-created', ({ RoomName, UserName }: { RoomName: string; UserName: string }) => {
      toast.success(`${UserName} created in room ${RoomName}❤️ `)
      setIsInRoom(RoomName)
    })

    socket.on('join-req-accepted', ({ RoomName, UserName }: { RoomName: string; UserName: string }) => {
      toast.success(`${UserName} accepted in room ${RoomName}❤️`)
      setIsInRoom(RoomName)
    })
    socket.on('req-join', (data => {
      toast(`${data.UserName} req to join in room ${data.RoomName}❤️`)
      setroomJoinReq(true)
      setroomjoinreqdata(data)
    }))

    return () => {
      socket.emit("user-disconnect", ({ room: RoomName, UserName }));
      socket.off("room-joined");
      setIsInRoom("");
    };
  }, [])




  return (
    <Box >
      <Navbar />
      {load && <div>loading</div>}
      <Typography my={10} variant="h4">google meet</Typography>

      {roomJoinReq && <Typography>req to join {roomjoinreqdata.UserName} <Button variant="contained" onClick={() => {
        socket.emit("Join-req-accepted", roomjoinreqdata)
        setroomJoinReq(false)
      }}>accept</Button> </Typography>}

      {IsInRoom === "" ?
        <Stack direction={"row"} gap={2} alignItems={"center"} component={"form"} onSubmit={(e) => {
          e.preventDefault()
          socket.emit("req-join", { RoomName, UserName })
        }} >
          <TextField type="text" required label="username" value={UserName} onChange={(e) => { setUserName(e.target.value) }} />
          <TextField type="text" required label="room" value={RoomName} onChange={(e) => { setRoomName(e.target.value) }} />

          <Button type="submit" variant="contained">join room</Button>
          <Button variant="contained" type="button" onClick={() => {
            socket.emit("create-room", { RoomName: "ashutosh" })
          }}>create room</Button>
        </Stack>

        :
        <Video room={IsInRoom} />
      }


    </Box>

  )
}
