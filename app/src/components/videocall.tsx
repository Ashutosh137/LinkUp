import { Fragment, useEffect, useRef, useState, useCallback } from 'react';
import socket from '../config/socket';
import toast from 'react-hot-toast';
import { Box, Stack } from '@mui/material';
import Video from '../layout/video';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import InitialStateProps from '../redux/initialprops';
import MessageBox from '../layout/MessageBox';
import CallController from '../layout/CallController';
import JoinReq from '../layout/JoinReq';
import Sound from '../utiliies/sound';
export default function VideoCall() {
  const { meetid } = useParams<{ meetid: string }>();
  const { name, ChatBox } = useSelector((state: InitialStateProps) => state);
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [reqJoinRoom, setReqJoinRoom] = useState<boolean>(false);
  const naviagte = useNavigate();

  interface NewCandidate {
    name: string;
    room: string;
  }

  interface Message {
    name: string;
    message: string;
    created_at: Date;
  }

  const [newCandidate, setNewCandidate] = useState<NewCandidate>({
    name: '',
    room: '',
  });

  const initWebRTC = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localRef.current) {
        localRef.current.srcObject = stream;
      }

      if (!peerConnectionRef.current) {
        peerConnectionRef.current = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
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

      stream.getTracks().forEach((track) => {
        peerConnectionRef.current!.addTrack(track, stream);
      });

      socket.emit('join-room', { room: meetid });

      socket.on(
        'join-req-accepted',
        ({ RoomName, name }: { RoomName: string; name: string }) => {
          toast.success(`${name} accepted in room ${RoomName}❤️`);
        }
      );
      socket.on('emoji', ({ emoji }: { emoji: string }) => {
        toast(emoji);
      });

      socket.on('req-join', (data) => {
        toast(`${data.name} requested to join room ${data.RoomName}❤️`);
        setReqJoinRoom(true);
        Sound();
        setNewCandidate(data);
      });

      socket.on('offer', handleOffer);
      socket.on('call end', () => {
        toast.error('Call ended');
        naviagte('/');
      });
      socket.on('answer', handleAnswer);
      socket.on('candidate', handleCandidate);
      socket.on('chat', (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });
      startCall();
    } catch (error) {
      console.error('Error accessing media devices.', error);
      toast.error('Error accessing media devices.');
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
      socket.emit('user-disconnect', { meetid, name });
    };
  }, [initWebRTC, meetid]);

  const handleOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;

    try {
      if (peerConnectionRef.current.signalingState === 'stable') {
        console.warn('Peer connection is in stable state, no offer to process');
      }

      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit('answer', { answer, room: meetid });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }, []);

  const handleAnswer = useCallback(
    async (answer: RTCSessionDescriptionInit) => {
      if (!peerConnectionRef.current) return;

      try {
        if (peerConnectionRef.current.signalingState !== 'have-remote-offer') {
          console.warn(
            'Peer connection is not in the right state to set answer'
          );
        }

        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    },
    []
  );

  const handleCandidate = useCallback(
    async (candidate: RTCIceCandidateInit) => {
      if (!peerConnectionRef.current) return;

      try {
        if (peerConnectionRef.current.signalingState === 'stable') {
          console.warn(
            'Peer connection is in stable state, no offer to process'
          );
        }

        peerConnectionRef.current.remoteDescription &&
          (await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          ));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    },
    []
  );

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

  const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message !== '') {
      const messagebox: Message = {
        name: name,
        message: message,
        created_at: new Date(),
      };
      socket.emit('new-message', { room: meetid, message: messagebox });
      setMessage('');
    }
  };

  return (
    <Fragment>
      {ChatBox && (
        <MessageBox
          messages={messages}
          setMessage={setMessage}
          message={message}
          handleMessageSubmit={handleMessageSubmit}
        />
      )}

      {reqJoinRoom && (
        <JoinReq
          meetid={meetid!}
          newCandidate={newCandidate}
          setReqJoinRoom={setReqJoinRoom}
        />
      )}

      <Box sx={{ padding: 2 }}>
        <Stack width="100%" direction={{ xs: 'column', sm: 'row' }} gap={5}>
          <Video ref={localRef} muted />
          <Video ref={remoteVideoRef} remote />
        </Stack>
      </Box>
      <CallController meetid={meetid!} />
    </Fragment>
  );
}
