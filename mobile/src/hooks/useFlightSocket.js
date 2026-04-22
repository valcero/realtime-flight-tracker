import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const CONNECTION_STATUS = {
  CONNECTING: "connecting",
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
  RECONNECTING: "reconnecting",
};

export default function useFlightSocket(serverUrl) {
  const [flights, setFlights] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState(
    CONNECTION_STATUS.CONNECTING
  );
  const [lastUpdate, setLastUpdate] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(serverUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnectionStatus(CONNECTION_STATUS.CONNECTED);
    });

    socket.on("server:ready", () => {
      // Backend acknowledged connection
    });

    socket.on("flights:update", (payload) => {
      if (payload && Array.isArray(payload.flights)) {
        setFlights(payload.flights);
        setLastUpdate(payload.timestamp || Date.now());
      }
    });

    socket.on("disconnect", (reason) => {
      setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
    });

    socket.io.on("reconnect_attempt", () => {
      setConnectionStatus(CONNECTION_STATUS.RECONNECTING);
    });

    socket.io.on("reconnect", () => {
      setConnectionStatus(CONNECTION_STATUS.CONNECTED);
    });

    socket.io.on("reconnect_failed", () => {
      setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [serverUrl]);

  const reconnect = useCallback(() => {
    if (socketRef.current && !socketRef.current.connected) {
      socketRef.current.connect();
      setConnectionStatus(CONNECTION_STATUS.CONNECTING);
    }
  }, []);

  return { flights, connectionStatus, lastUpdate, reconnect };
}

export { CONNECTION_STATUS };
