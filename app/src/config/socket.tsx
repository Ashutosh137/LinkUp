import { io } from 'socket.io-client';
import { BackEnd } from './config';
const socket = io(BackEnd);
export default socket;
