import { Fragment, useEffect, useRef, useState, useCallback } from "react";
import socket from "../config/socket";
import toast from "react-hot-toast";
import { Alert, Box, IconButton, Paper, Snackbar, Stack, TextField, Tooltip, Typography } from "@mui/material";
import Video from "../layout/video";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import InitialStateProps from "../redux/initialprops";
import Message from "../layout/message";
import { Cancel, CheckCircle, ContentCopyRounded, Send, ShareRounded } from "@mui/icons-material";
export default function VideoCall() {
    const { meetid } = useParams<{ meetid: string }>();
    const { name } = useSelector((state: InitialStateProps) => state);
    const localRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");
    const [reqJoinRoom, setReqJoinRoom] = useState<boolean>(false);
    const [snackbarOpen, setsnackbarOpen] = useState(false)
    interface NewCandidate {
        name: string;
        room: string;
    }

    interface Message {
        name: string;
        message: string;
        created_at: Date;
    }

    const [newCandidate, setNewCandidate] = useState<NewCandidate>({ name: "", room: "" });

    const initWebRTC = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

            if (localRef.current) {
                localRef.current.srcObject = stream;
            }

            if (!peerConnectionRef.current) {
                peerConnectionRef.current = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                });

                peerConnectionRef.current.ontrack = (event) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                };

                peerConnectionRef.current.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('candidate', event.candidate);
                    }
                };
            }

            stream.getTracks().forEach(track => {
                peerConnectionRef.current!.addTrack(track, stream);
            });

            socket.emit("join-room", { room: meetid });

            socket.on('join-req-accepted', ({ RoomName, name }: { RoomName: string; name: string }) => {
                toast.success(`${name} accepted in room ${RoomName}❤️`);
            });

            socket.on('req-join', (data) => {
                toast(`${data.name} requested to join room ${data.RoomName}❤️`);
                setReqJoinRoom(true);
                setNewCandidate(data);
            });

            socket.on('offer', handleOffer);
            socket.on('answer', handleAnswer);
            socket.on('candidate', handleCandidate);
            socket.on("chat", (message: Message) => {
                setMessages(prev => ([...prev, message]));
            });
            startCall();

        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    }, [meetid]);

    useEffect(() => {
        initWebRTC();

        return () => {
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
            socket.off('offer', handleOffer);
            socket.off('answer', handleAnswer);
            socket.off('candidate', handleCandidate);
            socket.off('stream-toggle');
            socket.emit("user-disconnect", { meetid,name });
        };
    }, [initWebRTC, meetid]);

    const handleOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
        if (!peerConnectionRef.current) return;

        try {
            if (peerConnectionRef.current.signalingState === 'stable') {
                console.warn('Peer connection is in stable state, no offer to process');
            }

            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            socket.emit('answer', { answer, room: meetid });
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    }, [meetid]);

    const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
        if (!peerConnectionRef.current) return;

        try {
            if (peerConnectionRef.current.signalingState !== 'have-remote-offer') {
                console.warn('Peer connection is not in the right state to set answer');
            }

            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
            console.error('Error handling answer:', error);
        }
    }, []);

    const handleCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
        if (!peerConnectionRef.current) return;

        try {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
        }
    }, []);

    const startCall = useCallback(async () => {
        if (!peerConnectionRef.current) return;

        try {
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            socket.emit('offer', { offer, room: meetid });
        } catch (error) {
            console.error('Error starting call:', error);
        }
    }, [meetid]);

    const handleCopyMeetId = () => {
        navigator.clipboard.writeText(meetid!);
        setsnackbarOpen(true);
    };

    const handleShareMeetId = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Meeting Room',
                text: `Join my meeting room: ${meetid}`,
                url: window.location.href
            }).catch((error) => console.log('Error sharing:', error));
        } else {
            handleCopyMeetId();
        }
    };



    const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const messagebox: Message = {
            name: name,
            message: message,
            created_at: new Date()
        };
        socket.emit("new-message", { room: meetid, message: messagebox });
        setMessage("");
    };

    console.log(peerConnectionRef.current)

    return (
        <Fragment>
            <Typography variant="h4" my={4} align="center" color="textPrimary" sx={{ fontWeight: 'bold' }}>
                Meet - {meetid}
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" mb={3}>
                <Tooltip title="Copy Meet ID">
                    <IconButton onClick={handleCopyMeetId} color="primary">
                        <ContentCopyRounded />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Share Meet ID">
                    <IconButton onClick={handleShareMeetId} color="primary">
                        <ShareRounded />
                    </IconButton>
                </Tooltip>
            </Stack>

            {reqJoinRoom && (
                <Paper  elevation={6} sx={{ padding: 3, marginBottom: 3,borderRadius:2 ,bgcolor:"black"}}>
                    <Stack mx="auto" gap={4} direction="row" justifyContent="center" alignItems="center">
                        <Typography variant="body1" color="white" sx={{ flexGrow: 1 }}>
                           <b> {newCandidate.name}</b> wants to join
                        </Typography>
                        <Tooltip color="primary" title="Accept">
                            <IconButton
                                color="success"
                                onClick={() => {
                                    socket.emit('Join-req-accepted', { name, RoomName: meetid });
                                    setReqJoinRoom(false);
                                }}
                            >
                                <CheckCircle />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                            <IconButton
                                color="error"
                                onClick={() => {
                                    socket.emit('Join-req-rejected', { name, RoomName: meetid });
                                    setReqJoinRoom(false);
                                }}
                            >
                                <Cancel />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Paper>
            )}

            <Box sx={{ padding: 2 }}>
                <Box
                    maxHeight={400}
                    sx={{
                        overflowY: 'scroll',
                        padding: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        width:"100%",
                        backgroundColor: 'background.paper'
                    }}
                >
                    <Typography variant="h6" color="initial" my={2} textTransform={"capitalize"} alignItems={"center"}>chat</Typography>
                    {messages.map((msg, index) => (
                        <Message message={msg} key={index} />
                    ))}
                </Box>

                <Stack position={"relative"} width="100%" my={5} direction={{ xs: 'column', sm: 'row' }} gap={5}>
                    <Video ref={localRef} muted />
                    <Video ref={remoteVideoRef} remote />
                </Stack>

                <Stack component="form" alignItems="center" gap={2} direction="row" onSubmit={handleMessageSubmit}>
                    <TextField
                        fullWidth
                        label="Type your message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: 2, backgroundColor: 'background.default' }}
                    />
                    <Tooltip title="Send">
                        <IconButton type="submit" color="primary">
                            <Send />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setsnackbarOpen(false)}
            >
                <Alert onClose={() => setsnackbarOpen(false)} severity="success">
                    Meet ID copied to clipboard!
                </Alert>
            </Snackbar>
        </Fragment>
    );
}
