import { useState, useEffect, useCallback, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  error: Error | null;
}

const SOCKET_OPTIONS = {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
};

export const useSocket = (endpoint: string) => {
  const needReconnect = useRef<boolean>(false);
  const [state, setState] = useState<SocketState>({
    socket: null,
    isConnected: false,
    error: null,
  });

  const initializeSocket = useCallback(async (url: string) => {
    const { origin, pathname } = new URL(url);
    return await io(origin + pathname, SOCKET_OPTIONS);
  }, []);

  const setupSocketListeners = useCallback((socket: Socket) => {
    if (!socket) return;
    const handleConnect = () => {
      console.log('%c*** Socket connected ***\nConnecting to:', 'color: violet', endpoint);
      setState((prev) => ({ ...prev, socket, isConnected: true, error: null }));
    };

    const handleError = (error: Error) => {
      console.error(`%c*** Socket error: ${error} ***`, 'color: red');
      setState((prev) => ({ ...prev, isConnected: false, error }));
    };

    const handleDisconnect = () => {
      console.log('%c*** Socket disconnected ***', 'color: violet');
      setState((prev) => ({ ...prev, isConnected: false }));
    };

    socket.on('connect', handleConnect);
    socket.on('connect_error', handleError);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleError);
      socket.off('disconnect', handleDisconnect);
      socket.close();
    };
  }, []);

  const reconnect = useCallback(() => {
    console.log('reconnect', state.socket);
    if (!state.socket) return;
    needReconnect.current = true;
    state.socket?.close();
    setState({ socket: null, isConnected: false, error: null });
  }, [state.socket]);

  useEffect(() => {
    if (!endpoint) return;
    if (!needReconnect.current && state.socket) return;
    needReconnect.current = false;
    initializeSocket(endpoint).then((socket) => {
      setupSocketListeners(socket);
    });
  }, [endpoint, state.socket, initializeSocket, setupSocketListeners]);

  return { socket: state.socket, reconnect, needReconnect: needReconnect.current };
};
