import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_BACKEND_DEV ||import.meta.env.VITE_BACKEND);
export default socket;
