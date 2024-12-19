import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  roomInfoState as useRoomInfoState,
  ChathubChatTimelineState as useChathubChatTimelineStore,
} from '@/shared/store/onpromise';
import { connectionInfoState as useConnectionInfoStore } from '@/shared/store/userinfo';

const SOCKET_EVENT = {
  FETCH_ROOM_ID: 'message',
  NEURON_STATUS: 'chat',
  NEURON_STATUS_END: 'neuron_status_end',
};

export const useSocketConnection = () => {
  const [socket, setSocket] = useState<any>(null);
  const [roomInfoState, setRoomInfoState] = useRecoilState(useRoomInfoState);
  const setChathubChatTimelineState = useSetRecoilState(useChathubChatTimelineStore);
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);

  useEffect(() => {
    if (!socket && connectionInfoState?.chathub.socket) {
      // const baseURL = import.meta.env.VITE_APP_PRO_AI;
      const baseURL = connectionInfoState.chathub.socket;
      const socketIo = io(baseURL, {
        transports: ['websocket'],
        // path: '/amore/socket.io',
      });

      socketIo.on('connect', () => {
        console.log('Socket connected!');
      });

      socketIo.on('connect_error', (error) => {
        console.error('Connection Error:', error);
      });

      socketIo.on(SOCKET_EVENT.FETCH_ROOM_ID, (data) => {
        setRoomInfoState((prev) => ({
          ...prev,
          socketId: data.room,
        }));
        setSocket(socketIo);
      });

      return () => {
        socketIo.disconnect();
      };
    }
  }, [connectionInfoState.chathub.socket, socket]);

  useEffect(() => {
    if (socket && roomInfoState.socketId) {
      socket.on(SOCKET_EVENT.NEURON_STATUS, (data: any) => {
        if (data) {
          const showingData = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
          const showingEngine = data.title ? data.title : data[0];
          const timeline = {
            userChat: '', // 이 부분은 적절히 조정 필요
            dataTitle: showingEngine,
            response: showingData,
          };

          setChathubChatTimelineState((prev) => ({
            ...prev,
            timeline: [...prev.timeline, timeline],
          }));
        }
      });

      socket.on(SOCKET_EVENT.NEURON_STATUS_END, (data: string) => {
        console.log(data);
        // 필요한 로직 추가
      });
    }

    return () => {
      if (socket) {
        socket.off(SOCKET_EVENT.NEURON_STATUS);
        socket.off(SOCKET_EVENT.NEURON_STATUS_END);
      }
    };
  }, [socket, roomInfoState.socketId, setChathubChatTimelineState]);
  return { socket };
};
