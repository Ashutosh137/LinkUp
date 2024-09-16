import React, { Fragment, useState } from 'react';
import {
  ChatBubble,
  ChatTwoTone,
  ContentCopyRounded,
  ShareRounded,
  SentimentSatisfiedAlt,
  CallEnd,
} from '@mui/icons-material';
import {
  Stack,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Box,
  Dialog,
  DialogTitle,
  Badge,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { ToggleChatBox } from '../redux/slice/userdataSlice';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useAppSelector } from '../redux/ḥooks';
import socket from '../config/socket';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Sound from '../utiliies/sound';

interface CallControllerProps {
  meetid: string;
  NewMessage: boolean;
}

const CallController: React.FC<CallControllerProps> = ({
  meetid,
  NewMessage,
}) => {
  const { ChatBox } = useAppSelector((state) => state);
  const dispatch = useDispatch();
  const naviagate = useNavigate();
  const [snackbarOpen, setsnackbarOpen] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleChat = () => {
    dispatch(ToggleChatBox());
  };

  console.log(NewMessage);

  const handleCopyMeetId = () => {
    navigator.clipboard.writeText(meetid);
    setsnackbarOpen(true);
  };

  const handleShareMeetId = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Meeting Room',
          text: `Join my meeting room: ${meetid}`,
          url: window.location.href,
        })
        .catch((error) => console.log('Error sharing:', error));
    } else {
      handleCopyMeetId();
    }
  };

  const handleEndCall = () => {
    toast.error('call ended Thankyou for joining ');
    Sound();
    socket.emit('call end', { room: meetid });
    naviagate('/');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEmojiSelect = (emoji: any) => {
    socket.emit('emoji', { room: meetid, emoji: emoji.native });
    toast(emoji.native);
    setEmojiPickerOpen(false);
  };

  return (
    <Fragment>
      <Box zIndex={1} position="fixed" bottom={3} left={0} width="100%">
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={3}
          padding={1}
          sx={{
            backgroundColor: 'background.default',
            boxShadow: 3,
          }}
        >
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
          <Tooltip title="Emoji Picker">
            <IconButton
              onClick={() => setEmojiPickerOpen(true)}
              color="primary"
            >
              <SentimentSatisfiedAlt />
            </IconButton>
          </Tooltip>
          <IconButton aria-label="chatbox" onClick={handleChat} color="primary">
            {!ChatBox ? (
              <Badge color="info" badgeContent={NewMessage ? 1 : null}>
                <ChatTwoTone />
              </Badge>
            ) : (
              <ChatBubble />
            )}
          </IconButton>
          <Tooltip title="End Call">
            <IconButton onClick={handleEndCall} color="warning">
              <CallEnd />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Dialog open={emojiPickerOpen} onClose={() => setEmojiPickerOpen(false)}>
        <DialogTitle>Select an Emoji</DialogTitle>
        <Picker data={data} onEmojiSelect={handleEmojiSelect} />
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={() => setsnackbarOpen(false)}
      >
        <Alert
          onClose={() => setsnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Meet ID copied to clipboard!
        </Alert>
      </Snackbar>
    </Fragment>
  );
};

export default CallController;
