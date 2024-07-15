import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Video from "./components/videocall";
import socket from "./socket";
import Navbar from "./layout/navbar";
import TextField from '@mui/material/TextField'
import { Box, Button, CircularProgress, Container, Stack, Typography, CardMedia } from "@mui/material";


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
    <Container sx={{ py: 10, mx: "auto" }} maxWidth={"xl"} >



      <Navbar />
      {load &&
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} position={"absolute"} sx={{
          inset: 0, width: "100%",
          zIndex: 5, backdropFilter: 'blur(10px)'
        }}>
          <CircularProgress />
        </Box>}

      {roomJoinReq && <Typography>req to join {roomjoinreqdata.UserName} <Button variant="contained" onClick={() => {
        socket.emit("Join-req-accepted", roomjoinreqdata)
        setroomJoinReq(false)
      }}>accept</Button> </Typography>}

      {IsInRoom === "" ? <Stack my={10} direction="row" alignItems={"center"} spacing={2} >
        <Box sx={{ width: "100%" }}>
          <Typography variant="h4" py={2} sx={{ textAlign: "center" }}>Videocalls and meetings for everyone
            <Typography variant="h6" sx={{ textAlign: "center" }}>Join a room or
              create a new room</Typography>
          </Typography>
          <Stack py={6} flexWrap={"wrap"} mx={"auto"} direction={"row"} gap={2} alignItems={"center"} justifyContent={"center"} component={"form"} onSubmit={(e) => {
            e.preventDefault()
            socket.emit("req-join", { RoomName, UserName })
          }} >
            <Button fullWidth sx={{ maxWidth: 200 }} variant="contained" type="button" onClick={() => {
              socket.emit("create-room", { RoomName: "ashutosh" })
            }}>New Meeting</Button>
            <TextField type="text" required label="username" value={UserName} onChange={(e) => { setUserName(e.target.value) }} />
            <TextField type="text" required label="room" value={RoomName} onChange={(e) => { setRoomName(e.target.value) }} />
            <Button disabled={RoomName.length <= 7} type="submit" variant="contained">join room</Button>
          </Stack>
        </Box>

        <Box sx={{ width: "100%" }}>
          <CardMedia component={"img"} sx={{ width: 400, margin: "auto", borderRadius: 10 }} image="https://hbr.org/resources/images/article_assets/2022/09/R2206L_LEES.jpg" />
        </Box>
      </Stack> :
        <Video room={IsInRoom} />
      }
    </Container>

  )
}
