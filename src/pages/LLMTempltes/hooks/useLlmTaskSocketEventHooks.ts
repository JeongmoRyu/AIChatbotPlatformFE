import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useRecoilState } from 'recoil';

import { SOCKET_EVENT_LLM } from '@/shared/lib/llmTaskUi';

import { connectionInfoState as useConnectionInfoStore } from '@/shared/store/userinfo';

type CONNECT_TYPE = 'LLM' | 'SDF';

interface SocketEventProps {
  REQUEST: string;
  RESPONSE_START: string;
  RESPONSE: string;
  RESPONSE_END: string;
}

export const useLlmTaskSocketEventHooks = (connectType: CONNECT_TYPE) => {
  const [isConnect, setIsConnect] = useState<boolean>(false);
  const [socket, setSocket] = useState<any>(null);
  const [events, setEvents] = useState<SocketEventProps>();
  const [endEvent] = useState<boolean>(false);

  const [llmStartRes, setLlmStartRes] = useState<boolean>(false);
  const [llmRes, setLlmRes] = useState<string>('');
  const [excelLLMRes, setExcelLLMRes] = useState<[]>([]);
  const [llmEndRes, setLlmEndRes] = useState<boolean>(false);

  const excelLLMAction = useRef<boolean>(false);

  const [connectionInfoState] = useRecoilState(useConnectionInfoStore);

  // const hostname = window.location.hostname;

  useEffect(() => {
    console.log('fetchHostname', connectionInfoState);
  }, [connectionInfoState]);

  useEffect(() => {
    setEvents(SOCKET_EVENT_LLM[connectType]);
    window.addEventListener('beforeunload', clearSocketConnection);
    return () => {
      window.removeEventListener('beforeunload', clearSocketConnection);
      console.log('***Socket disconnected ***');
      if (socket) {
        clearSocketConnection();
      }
    };
  }, []);

  useEffect(() => {
    if (socket && events) {
      const addListeners = () => {
        socket.on(events.RESPONSE_START, () => {
          setLlmRes('');
          setLlmStartRes(true);
          setLlmEndRes(false);
        });
        socket.on(events.RESPONSE, (res: any) => {
          // console.log(`${events.responseEvent}`, res);
          console.log('res', res);
          if (excelLLMAction.current) {
            setExcelLLMRes(res);
            excelLLMAction.current = false;
          } else {
            if (!res) return;

            setLlmRes((prev) => prev + res);
          }
        });
        socket.on(events.RESPONSE_END, () => {
          // console.log(`${events.endEvent}`, res);
          setLlmEndRes(true);
        });

        socket.on('disconnect', () => {
          console.log('disconnect');
        });
      };

      addListeners();
      setIsConnect(true);
    }
  }, [socket]);

  const clearSocketConnection = () => {
    if (socket) {
      console.log('***Socket disconnected ***');
      socket.disconnect();
      setIsConnect(false);
      setSocket(null);
      setLlmStartRes(false);
      setLlmRes('');
      setLlmEndRes(false);
    }
  };

  const connectSocketServer = () => {
    if (!socket) {
      console.log(' ***  Call Socket connecting  ***');

      console.log('llm socket connectionInfoState', connectionInfoState.llm);
      const connectInfo = connectionInfoState.llm.socket;
      console.log('llm socket connectInfo', connectInfo);

      let connectedSocket: Socket;
      connectedSocket = io(connectInfo, {
        transports: ['websocket'],
      });

      if (connectedSocket) {
        console.log(connectedSocket);
        setSocket(connectedSocket);
      }
    }
  };

  const sendClientData = (action: string, params: any) => {
    if (!socket) return;
    if (action === 'info_mask_excel') excelLLMAction.current = true;

    console.log(action, params);

    if (events) {
      socket.emit(events.REQUEST, action, params);
    }
  };

  const clearResponseData = () => {
    setLlmStartRes(false);
    setLlmRes('');
    setLlmEndRes(false);
  };

  return {
    connectSocketServer,
    sendClientData,
    clearSocketConnection,
    clearResponseData,
    llmStartRes,
    llmRes,
    llmEndRes,
    isConnect,
    endEvent,
    excelLLMRes,
  };
};
