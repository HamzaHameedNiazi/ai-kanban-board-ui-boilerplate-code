import { io } from "socket.io-client";
import { getToken } from "./api";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL
  ? "http://localhost:3000"
  : "";

let socket = null;

// Lazily create (and authenticate) the shared socket connection.
export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: {
        token: getToken(),
      },
      transports: ["websocket"],
    });
  }

  return socket;
};

export const connectSocket = () => {
  const s = getSocket();

  // Refresh token before every connection
  s.auth = {
    token: getToken(),
  };

  if (!s.connected) {
    s.connect();
  }

  return s;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
