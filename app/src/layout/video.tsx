import { CardMedia, Box } from '@mui/material';
import { forwardRef } from 'react';

interface VideoProps {
  muted?: boolean;
  remote?: boolean;
}

const Video = forwardRef<HTMLVideoElement, VideoProps>(
  ({ muted = false, remote = false }, ref) => {
    return (
      <Box sx={{ width: '100%' }}>
        <CardMedia
          autoPlay
          playsInline
          sx={{ width: '100%', borderRadius: { xs: 3, md: 5 } }}
          component="video"
          ref={ref}
          muted={muted || !remote}
        />
      </Box>
    );
  }
);

export default Video;
