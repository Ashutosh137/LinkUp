import { Stack, Typography, Avatar, Paper, Divider } from '@mui/material';
import convertTime from '../utiliies/time';
import Linkify from 'linkify-react';

interface Message {
  name: string;
  message: string;
  created_at: Date;
}

function Message({ message }: { message: Message }) {
  return (
    <Paper
      elevation={5}
      sx={{
        padding: { xs: 1, sm: 2 },
        borderRadius: 2,
        marginBottom: { xs: 1, sm: 2 },
        backgroundColor: 'background.paper',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar
          sx={{ width: 30, height: 30 }}
          alt={message.name.toUpperCase()}
        />
        <Stack spacing={1} sx={{ flex: 1 }}>
          <Typography
            variant="body1"
            fontWeight="bold"
            textTransform={'capitalize'}
            color="text.primary"
          >
            {message.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Linkify>{message.message}</Linkify>
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="caption" color="text.secondary">
            {convertTime(message.created_at)}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

export { Message };
