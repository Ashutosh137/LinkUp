import { CloseRounded, Send } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Message as Messagess } from './message';
import { useDispatch } from 'react-redux';
import { ToggleChatBox } from '../redux/slice/userdataSlice';
import { FormEventHandler, useEffect } from 'react';

interface Message {
  name: string;
  message: string;
  created_at: Date;
}

function MessageBox({
  messages,
  message,
  setMessage,
  setNewMessage,
  handleMessageSubmit,
}: {
  messages: Message[];
  message: string;
  setMessage: (message: string) => void;
  setNewMessage: (NewMessage: boolean) => void;
  handleMessageSubmit: FormEventHandler;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    setNewMessage(false);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        width: '100%',
        maxWidth: { xs: '100%', sm: 400 },
        zIndex: 2,
        backgroundColor: 'background.paper',
        boxShadow: 3,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          marginY: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" margin={'auto'} textTransform={'capitalize'}>
          Messages
        </Typography>
        <IconButton
          aria-label="close"
          onClick={() => dispatch(ToggleChatBox())}
        >
          <CloseRounded />
        </IconButton>
      </Box>

      <Box
        sx={{
          overflowY: 'auto',
          maxHeight: 300,
          padding: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {messages.length === 0 ? (
          <Typography
            variant="subtitle2"
            color="textSecondary"
            textAlign="center"
          >
            Messages will display here.
          </Typography>
        ) : (
          messages.map((msg, index) => <Messagess message={msg} key={index} />)
        )}
      </Box>

      <Stack
        component="form"
        onSubmit={handleMessageSubmit}
        direction="row"
        alignItems="center"
        padding={2}
        spacing={2}
      >
        <TextField
          fullWidth
          label="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          variant="outlined"
          size="small"
        />
        <Tooltip title="Send">
          <IconButton type="submit" color="primary">
            <Send />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}

export default MessageBox;
