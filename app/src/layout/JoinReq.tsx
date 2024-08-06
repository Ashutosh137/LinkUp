import { Button, Paper, Stack, Tooltip, Typography } from '@mui/material';
import socket from '../config/socket';
import { useAppSelector } from '../redux/ḥooks';

interface NewCandidate {
  name: string;
  room: string;
}

function JoinReq({
  meetid,
  newCandidate,
  setReqJoinRoom,
}: {
  setReqJoinRoom: (ReqJoinRoom: boolean) => void;
  meetid: string;
  newCandidate: NewCandidate;
}) {
  const { name } = useAppSelector((state) => state);

  return (
    <Paper
      elevation={16}
      sx={{
        padding: 3,
        bgcolor: 'black',
        zIndex: 5,
        borderRadius: 2,
        position: 'absolute',
        inset: 0,
        height: 30,
      }}
    >
      <Stack
        gap={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="body1" color="white" sx={{ flexGrow: 1 }}>
          <b> {newCandidate.name}</b> wants to join
        </Typography>
        <Tooltip color="primary" title="Accept">
          <Button
            variant="outlined"
            size="small"
            color="success"
            onClick={() => {
              socket.emit('Join-req-accepted', { name, RoomName: meetid });
              setReqJoinRoom(false);
            }}
          >
            Join
          </Button>
        </Tooltip>
        <Tooltip title="Reject">
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => {
              socket.emit('Join-req-rejected', { name, RoomName: meetid });
              setReqJoinRoom(false);
            }}
          >
            Leave
          </Button>
        </Tooltip>
      </Stack>
    </Paper>
  );
}

export default JoinReq;
