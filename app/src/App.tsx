import { ChangeEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const socket = io('http://localhost:3000');

export default function App() {
  const [InRoom, setInRoom] = useState(false);
  const [room, setroom] = useState("");
  const localref = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [messages, setmessages] = useState<string[]>([]);
  const [message, setmessage] = useState("");
  const screenref = useRef<RTCSessionDescriptionInit>(null)

  const [iscalling, setiscalling] = useState(null)

  useEffect(() => {
    const initWebRTC = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // const displaystream = await navigator.mediaDevices.getDisplayMedia({ video: true});
        console.log(localref)
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

        peerConnectionRef.current.ontrack = (event) => {
          remoteVideoRef.current!.srcObject = event.streams[0];
        };

        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('candidate', event.candidate);
          }
        };

        socket.on('offer', handleOffer);
        socket.on('answer', handleAnswer);
        socket.on('candidate', handleCandidate);
        socket.on("chat", (message) => {
          setmessages(prev => ([...prev, message]))
        });
        socket.on("room-joined", () => {
          setInRoom(true)
        });

      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    initWebRTC();

    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('candidate', handleCandidate);
    };
  }, []);

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;

    console.log("getting offer");

    setiscalling(offer)



  };
  console.log(peerConnectionRef.current)
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
    socket.emit('offer', offer);
  };

  return (
    <div>
      {iscalling && <div>caling
        <button onClick={async () => {
          setiscalling(null)
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(iscalling));
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socket.emit('answer', answer);
        }}>accept</button></div>}
      <div>
        <h1>Welcome to {room}</h1>
        <button onClick={startCall}>Start Call</button>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}


        <video ref={localref} autoPlay playsInline muted />
        <video ref={remoteVideoRef} autoPlay playsInline />
        <video ref={screenref} autoPlay playsInline />
        <div>
          <input value={message} onChange={(e) => setmessage(e.target.value)} type="text" />
          <button onClick={() => { socket.emit("new-message", message) }}>Send</button>
        </div>
      </div>

    </div>
  )
}
