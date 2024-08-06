import { Container } from '@mui/material';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import VideoCall from './components/videocall';
import Login from './pages/Login';
import Register from './pages/register';
import Navbar from './layout/navbar';
import { AutoLogin } from './redux/slice/userdataSlice';
import { useAppDispatch } from './redux/ḥooks';
function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(AutoLogin());
  }, []);

  return (
    <Container maxWidth={'xl'} sx={{ mt: 15 }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/meet/:meetid" element={<VideoCall />} />
      </Routes>
    </Container>
  );
}

export default App;
