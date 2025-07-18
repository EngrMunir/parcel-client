
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  withCredentials: true,
});

export const useSocket = () => {
  return socket;
};
