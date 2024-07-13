import { useEffect, useRef, useState } from "react";
import socket from "../socket";
import toast from "react-hot-toast";
import CardMedia from '@mui/material/CardMedia'
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

export default function Video({ room }: { room: string }) {
    const localref = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const [messages, setmessages] = useState<string[]>([]);
    const [message, setmessage] = useState("");

    const [iscalling, setiscalling] = useState<RTCSessionDescriptionInit | null>()

    useEffect(() => {
        const initWebRTC = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                // const displaystream = await navigator.mediaDevices.getDisplayMedia({ video: true});
                if (localref.current) {
                    localref.current.srcObject = stream;
                } else {
                    console.error('localref is not set');
                }
                if (peerConnectionRef.current) {
                    peerConnectionRef.current! = new RTCPeerConnection({
                        iceServers: [
                            { urls: 'stun:stun.l.google.com:19302' }
                        ]
                    });
                }

                stream.getTracks().forEach(track => {
                    peerConnectionRef.current!.addTrack(track, stream);
                });

                peerConnectionRef.current!.ontrack = (event) => {
                    remoteVideoRef.current!.srcObject = event.streams[0];
                };

                peerConnectionRef.current!.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('candidate', event.candidate);
                    }
                };

                socket.on('offer', handleOffer);
                socket.on('user disconnected', handleDisconnect);
                socket.on('answer', handleAnswer);
                socket.on('candidate', handleCandidate);
                socket.on("chat", (message) => {
                    console.log(message)
                    setmessages(prev => ([...prev, message]))
                });
                socket.on("room-joined", () => {
                });

            } catch (error) {
                console.error('Error accessing media devices.', error);
            }
        };

        initWebRTC();

        return () => {
            socket.off('offer', handleOffer);
            socket.off('answer', handleAnswer);
            socket.emit("user-disconnect", ({ room }));
            socket.off('candidate', handleCandidate);
        };
    }, []);

    const handleDisconnect = (username: string) => {
        toast.error(`user ${username} disconnected`)
    }
    const handleOffer = async (offer: RTCSessionDescriptionInit) => {
        if (!peerConnectionRef.current) return;
        setiscalling(offer)
    };
    const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
        if (!peerConnectionRef.current) return;

        console.log("getting answer");
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleCandidate = async (candidate: RTCIceCandidateInit) => {
        if (!peerConnectionRef.current) return;

        console.log("getting candidate");
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    };

    const startCall = async () => {
        const offer = await peerConnectionRef.current!.createOffer();
        await peerConnectionRef.current!.setLocalDescription(offer);
        socket.emit('offer', { offer, room });
    };

    return (
        <Stack>
            <Typography variant="h6" color="initial">Room - {room}</Typography>
            {iscalling && <Box>caling
                <Button onClick={async () => {
                    await peerConnectionRef.current!.setRemoteDescription(new RTCSessionDescription(iscalling));
                    const answer = await peerConnectionRef.current!.createAnswer();
                    await peerConnectionRef.current!.setLocalDescription(answer);
                    setiscalling(null)
                    socket.emit('answer', { answer, room });
                }}>accept</Button></Box>}
            <Box>
                <Button variant="contained" onClick={startCall}>Start Call</Button>
                {messages.map((message, index) => (
                    <Typography key={index}>{message}</Typography>
                ))}

                <CardMedia component={"video"} ref={localref} autoPlay playsInline muted />
                <CardMedia component={"video"} ref={remoteVideoRef} autoPlay playsInline />
                <Stack alignItems={"center"} gap={2} direction={"row"}>
                    <TextField fullWidth label="message" value={message} onChange={(e) => setmessage(e.target.value)} type="text" />
                    <Button variant="contained" onClick={() => { socket.emit("new-message", { room, message }); setmessage("") }}>Send</Button>
                </Stack>
            </Box>

        </Stack>
    )
}
