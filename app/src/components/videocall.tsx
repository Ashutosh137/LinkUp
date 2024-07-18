import { Fragment, useEffect, useRef, useState } from "react";
import socket from "../config/socket";
import toast from "react-hot-toast";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import Video from "../layout/video";
import { useParams } from "react-router-dom";

export default function VideoCall() {
    const { meetid } = useParams()
    const localref = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const [messages, setmessages] = useState<string[]>([]);
    const [message, setmessage] = useState("");


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
                peerConnectionRef.current = new RTCPeerConnection({
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' }
                    ]
                });

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
                socket.on("meetid-joined", () => {
                });

            } catch (error) {
                console.error('Error accessing media devices.', error);
            }
        };

        initWebRTC();
        startCall();

        return () => {
            socket.off('offer', handleOffer);
            socket.off('answer', handleAnswer);
            socket.emit("user-disconnect", ({ meetid }));
            socket.off('candidate', handleCandidate);
        };
    }, []);

    const handleDisconnect = (username: string) => {
        toast.error(`user ${username} disconnected`)
    }
    const handleOffer = async (offer: RTCSessionDescriptionInit) => {
        if (!peerConnectionRef.current) return;
        await peerConnectionRef.current!.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnectionRef.current!.createAnswer();
        await peerConnectionRef.current!.setLocalDescription(answer);
        socket.emit('answer', { answer, meetid });
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
        socket.emit('offer', { offer, meetid });
    };
    return (
        <Fragment>
            <Typography variant="h6" my={2} alignItems={"center"} color="initial">meet - {meetid}</Typography>
            <Box>
                <Button variant="contained" onClick={startCall}>Start Call</Button>
                {messages.map((message, index) => (
                    <Typography key={index}>{message}</Typography>
                ))}

                <Stack height={"80%"} my={5} direction={"row"} gap={5}>
                    <Video ref={localref} muted />
                    <Video ref={remoteVideoRef} />
                </Stack>
                <Stack component={"form"} alignItems={"center"} gap={2} direction={"row"} onSubmit={(e) => {
                    e.preventDefault()
                    socket.emit("new-message", { meetid, message });
                    setmessage("")
                }}>
                    <TextField fullWidth label="message" value={message} onChange={(e) => setmessage(e.target.value)} type="text" />
                    <Button type="submit" variant="contained">Message</Button>
                </Stack>
            </Box>
        </Fragment>
    )
}
