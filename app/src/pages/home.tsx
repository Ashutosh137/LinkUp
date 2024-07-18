import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import socket from "../config/socket";
import Navbar from "../layout/navbar";
import TextField from '@mui/material/TextField'
import { Box, Button, Container, Stack, Typography, CardMedia } from "@mui/material";
import VideoCall from "../components/videocall";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import InitialStateProps from "../redux/initialprops";
// import Loader from "../ui/loader";


export default function Home() {
    const { name } = useSelector((state: InitialStateProps) => state)
    const [RoomName, setRoomName] = useState("")
    const [IsInRoom, setIsInRoom] = useState("")
    const navigate = useNavigate()
    const [roomJoinReq, setroomJoinReq] = useState(false)
    const [load, setload] = useState(true)

    const [roomjoinreqdata, setroomjoinreqdata] = useState({ name, RoomName })
    console.log(load)


    useEffect(() => {
        socket.on("connect", () => { setload(false) })
        socket.on('room-joined', ({ RoomName, name }: { RoomName: string; name: string }) => {
            toast.success(`${name} joined in room ${RoomName}❤️ room joined`)
            setIsInRoom(RoomName)

        })
        socket.on('room-created', ({ RoomName, name }: { RoomName: string; name: string }) => {
            toast.success(`${name} created in room ${RoomName}❤️ `)
            navigate(`/meet/${RoomName}`)
        })

        socket.on('join-req-accepted', ({ RoomName, name }: { RoomName: string; name: string }) => {
            toast.success(`${name} accepted in room ${RoomName}❤️`)
            navigate(`/meet/${RoomName}`)
            setIsInRoom(RoomName)
        })
        socket.on('req-join', (data => {
            toast(`${data.name} req to join in room ${data.RoomName}❤️`)
            setroomJoinReq(true)
            setroomjoinreqdata(data)
        }))

        return () => {
            socket.emit("user-disconnect", ({ room: RoomName, name }));
            socket.off("room-joined");
            setIsInRoom("");
        };
    }, [])


    return (
        <Container sx={{ py: 10, mx: "auto" }} maxWidth={"xl"} >

            <Navbar />

            {/* {load && <Loader />} */}

            {roomJoinReq && <Typography>req to join {roomjoinreqdata.name} <Button variant="contained" onClick={() => {
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
                        socket.emit("req-join", { name ,RoomName})
                    }} >
                        <Button fullWidth sx={{ maxWidth: 200 }} variant="contained" type="button" onClick={() => {
                            socket.emit("create-room", { RoomName: "ashutosh" })
                        }}>New Meeting</Button>
                        <TextField type="text" required label="room" value={RoomName} onChange={(e) => { setRoomName(e.target.value) }} />
                        <Button disabled={RoomName.length <= 9} type="submit" variant="contained">join room</Button>
                    </Stack>
                </Box>

                <Box sx={{ width: "100%" }}>
                    <CardMedia component={"img"} sx={{ width: 400, margin: "auto", borderRadius: 10 }} image="https://hbr.org/resources/images/article_assets/2022/09/R2206L_LEES.jpg" />
                </Box>
            </Stack> :
                <VideoCall />
            }
        </Container>

    )
}
