import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export const socket = io(SOCKET_URL);

export const connectSocket = () => {
  socket.on('connect', () => {
    console.log('Connected to socket server');
  });
};

export const disconnectSocket = () => {
  socket.disconnect();
}; 