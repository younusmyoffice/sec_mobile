import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create Context
const SocketContext = createContext();

// Define Backend URL
// const SOCKET_URL = "http://10.0.2.2:4000"; // Update with your backend URL
const SOCKET_URL = "http://chat.shareecare.com"; 

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Establish socket connection
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    setSocket(newSocket);

    // Connection events
    newSocket.on("connect", () => {
      console.log("✅ Connected to Socket.IO Server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO Server");
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);
console.log("mysocket",socket)
  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom Hook to Use Socket Context
export const useSocket = () => {
  return useContext(SocketContext);
};
