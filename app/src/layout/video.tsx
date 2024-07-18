import { CardMedia, Box, IconButton } from '@mui/material';
import { useState, forwardRef } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import { MicOffRounded, VideoCameraBackOutlined } from '@mui/icons-material';
interface VideoProps {
  muted?: boolean;
}
const Video = forwardRef<HTMLVideoElement, VideoProps>((props, ref) => {
  const [mute, setMute] = useState(props.muted);
  const [video, setvideo] = useState(true);

  return (
    <Box sx={{ width: "100%" }} position={"relative"}>
      {video ? <CardMedia
        autoPlay
        playsInline
        sx={{ width: "100%", margin: "auto", borderRadius: 10 }}
        component="video"
        ref={ref}
        muted={mute}

      /> : <Box sx={{ width: "100%", margin: "auto", borderRadius: 10 }} bgcolor={"black"}></Box>}

      {<Box
        component="span"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        position="absolute"
        gap={5}
        fontSize={10}
        sx={{ width: "100%", height: "10%", bottom: 0, backgroundColor: "rgb(0,0,0,0.4)", zIndex: 1, RadiusBottomleft: 10, RadiusBottomright: 10 }}
      >

        <IconButton onClick={() => setMute((prev) => !prev)} sx={{ borderRadius: "100%", aspectRatio: 1 }} >{mute ? <MicOffRounded /> : <MicIcon />}</IconButton>
        <IconButton onClick={() => setvideo((prev) => !prev)} sx={{ borderRadius: "100%", aspectRatio: 1 }} ><VideoCameraBackOutlined /> </IconButton>
      </Box>}
    </Box>
  );
});

export default Video;
