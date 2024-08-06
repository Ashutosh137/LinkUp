import { Box, CircularProgress } from '@mui/material';
function Loader() {
  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      position={'absolute'}
      sx={{
        inset: 0,
        width: '100%',
        zIndex: 5,
        backdropFilter: 'blur(10px)',
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default Loader;
