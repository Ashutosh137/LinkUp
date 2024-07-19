import { FormEventHandler, useEffect, useState } from "react";
import toast from "react-hot-toast";
import socket from "../config/socket";
import Navbar from "../layout/navbar";
import TextField from '@mui/material/TextField'
import { Box, Button, Container, Stack, Typography, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import InitialStateProps from "../redux/initialprops";
import Loader from "../layout/ui/loader";
import { useAppDispatch } from "../redux/ḥooks";
import { AutoLogin } from "../redux/userdataSlice";


export default function Home() {
    const { name, isLoading, isLoggedIn } = useSelector((state: InitialStateProps) => state)
    const [RoomName, setRoomName] = useState("")
    const navigate = useNavigate()
    const [load, setload] = useState(true)
    const dispatch = useAppDispatch()

    useEffect(() => {
        socket.on("connect", () => { setload(false) })
        socket.on('room-created', ({ RoomName, name }: { RoomName: string; name: string }) => {
            toast.success(`${name} created in room ${RoomName}❤️ `)
            navigate(`/meet/${RoomName}`)
        })

        socket.on('join-req-accepted', ({ RoomName, name }: { RoomName: string; name: string }) => {
            toast.success(`${name} accepted in room ${RoomName}❤️`)
            navigate(`/meet/${RoomName}`)
        })
        socket.on('Join-req-rejected', ({ RoomName, name }: {
            RoomName: string; name: string
        }) => {
            toast.error(`${name} rejected in room ${RoomName}😢`)
        })

        return () => {
            // socket.emit("user-disconnect", ({ room: RoomName, name }));
            socket.off("room-joined");
            setload(false)
        };
    }, [])


    useEffect(() => {
        if (name === "") {
            dispatch(AutoLogin())
        }
    }, [name])


    const handleJoinMeet: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        if (isLoggedIn) {
            socket.emit("req-join", { name, RoomName })
        }
        else {
            navigate("/login")
        }
    }


    return (
        <Container sx={{ py: 10, mx: "auto" }} maxWidth={"xl"} >

            <Navbar />

            {(isLoading || load) && <Loader />}


            <Stack my={10} direction={{ xs: "column-reverse", md: "row" }} alignItems={"center"} spacing={2} >
                <Box sx={{ width: "100%" }}>
                    <Typography variant="h4" py={2} sx={{ textAlign: "center" }}>Videocalls and meetings for everyone
                        <Typography component={"p"} variant="h6" sx={{ textAlign: "center" }}>Join a room or
                            create a new room</Typography>
                    </Typography>


                    <Stack py={6} flexWrap={"wrap"} mx={"auto"} direction={"row"} gap={2} alignItems={"center"} justifyContent={"center"} component={"form"} onSubmit={handleJoinMeet} >
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
            </Stack >
        </Container >

    )
}
