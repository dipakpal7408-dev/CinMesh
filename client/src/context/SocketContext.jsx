import { createContext, useEffect, useRef, useState, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import { API_BASE_URL } from "../services/api";

export const SocketContext = createContext(null);

const SOCKET_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export const SocketProvider = ({ children }) => {
  const { token, user } = useContext(AuthContext);
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());

  useEffect(() => {
    if (!token || !user) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnected(false);
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("presence:update", ({ userId, isOnline }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        if (isOnline) next.add(String(userId));
        else next.delete(String(userId));
        return next;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [token, user]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, onlineUserIds }}>
      {children}
    </SocketContext.Provider>
  );
};
