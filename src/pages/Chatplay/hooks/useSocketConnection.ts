import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';

import {
  roomInfoStateChatplay as useRoomInfoState,
  ChatPlayChatTimelineState as useChatPlayChatTimelineStore,
  ChatPlayChatHistoryStreamState,
  chatPlayTabInfoState,
  ChatPlayChatHistoryState,
  isChatLoading,
} from '@/shared/store/chatplay';
import { userLoginState as useUserLoginStore } from '@/shared/store/onpromise';
import io from 'socket.io-client';
import { showNotification } from '@/shared/utils/common-helper';

import { SOCKET_EVENT } from '@/shared/lib/chatplayOptions';

import { connectionInfoState as useConnectionInfoStore } from '@/shared/store/userinfo';

const useSocketConnection = () => {
  const { i18n } = useTranslation();
  const [socket, setSocket] = useState<any>(null);
  const roomInfoState = useRecoilValue(useRoomInfoState);

  const userLoginState = useRecoilValue(useUserLoginStore);
  const setChatPlayChatTimelineState = useSetRecoilState(useChatPlayChatTimelineStore);
  const setChatPlayChatHistoryStreamState = useSetRecoilState(ChatPlayChatHistoryStreamState);
  const resetChatPlayChatHistoryStreamState = useResetRecoilState(ChatPlayChatHistoryStreamState);
  const [chatPlayChatHistoryState, setChatPlayChatHistoryState] = useRecoilState(ChatPlayChatHistoryState);
  const setActiveTab = useSetRecoilState(chatPlayTabInfoState);

  const [connectionInfoState] = useRecoilState(useConnectionInfoStore);

  const [isLoading, setIsLoading] = useRecoilState<boolean>(isChatLoading);

  const connectSocketIo = () => {
    if (socket && socket.connected) return;

    console.log('%c*** ChatPlay Connecting Socket ***', 'color:blue;');

    const connectionUrl = `${connectionInfoState.chatplay.socket}`;

    const connectedSocket = io(connectionUrl, {
      transports: ['websocket'],
      // path: connectionUrl,
      query: {
        user_id: userLoginState.userId,
      },
    });

    if (connectedSocket) {
      console.log('*** ChatPlay Connected Socket ***');

      setSocket(connectedSocket);
    } else {
      console.log('Socket Connection is failed!!');
    }
  };

  useEffect(() => {
    if (socket && !roomInfoState.isMakingQuestions) {
      console.log('%c*** ChatPlay Socket Connection is established ***', 'color: green;');

      const handleLogStreamStart = (data: ChatPlay_SOCKET_DATA) => {
        const showingData = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
        const showingEngine = data.title ? data.title : data[0];
        const timeline: ChatPlayTimelineType = {
          dataTitle: showingEngine,
          response: showingData,
        };

        console.log('handleLogStreamStart');

        setChatPlayChatTimelineState((prev) => ({
          ...prev,
          timeline: [...prev.timeline, timeline],
        }));
      };

      const handleChatbotResponse = (data: string) => {
        if (roomInfoState.isMakingQuestions) return;

        setChatPlayChatHistoryStreamState((prev: any) => ({
          ...prev,
          answer: prev.answer + data,
        }));
      };

      const handleResponse = (data: ChatPlay_SOCKET_DATA, isRag: boolean) => {
        if (roomInfoState.isMakingQuestions) return;
        const showingData = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);

        setChatPlayChatHistoryStreamState((prev: any) => ({
          ...prev,
          isLoading: false,
        }));
        const history: ChatPlayHistoryType = {
          role: 'assistant',
          content: showingData,
          ...(isRag && { retriever: data.retriever }),
        };

        setChatPlayChatHistoryState((prev) => ({
          ...prev,
          history: [...prev.history, history],
        }));
        resetChatPlayChatHistoryStreamState();
        const showingEngine = data.title ? data.title : data[0];
        const timeline: ChatPlayTimelineType = {
          dataTitle: showingEngine,
          response: showingData,
        };

        setChatPlayChatTimelineState((prev) => ({
          ...prev,
          timeline: [...prev.timeline, timeline],
        }));
        setActiveTab('testlog');
        setIsLoading(false);
      };

      const handleLogStreamEnd = (data: ChatPlay_SOCKET_DATA) => {
        setIsLoading(false);
        handleResponse(data, false);
      };

      const handleRagResponse = (data: ChatPlay_SOCKET_DATA) => {
        handleResponse(data, true);
      };

      const handleCreatedRoom = (data: string) => {
        console.log(data);
      };

      const handleError = (data: IResponseError) => {
        setIsLoading(false);
        console.log(data);
        showNotification(data.message || '요청 중 오류가 발생했습니다.', 'error');
        setChatPlayChatHistoryStreamState((prev: any) => ({
          ...prev,
          isLoading: false,
        }));
      };

      socket.on(SOCKET_EVENT.LOG_STREAM_START, handleLogStreamStart);
      socket.on(SOCKET_EVENT.CHATBOT_RESPONSE, handleChatbotResponse);
      socket.on(SOCKET_EVENT.LOG_STREAM_END, handleLogStreamEnd);
      socket.on(SOCKET_EVENT.RAG_RESPONSE, handleRagResponse);
      socket.on(SOCKET_EVENT.CREATED_ROOM, handleCreatedRoom);
      socket.on(SOCKET_EVENT.ERROR, handleError);
      socket.on(SOCKET_EVENT.ERROR_LLM_REQUEST, handleError);

      return () => {
        socket.off(SOCKET_EVENT.LOG_STREAM_START);
        socket.off(SOCKET_EVENT.CHATBOT_RESPONSE);
        socket.off(SOCKET_EVENT.LOG_STREAM_END);
        socket.off(SOCKET_EVENT.RAG_RESPONSE);
        socket.off(SOCKET_EVENT.CREATED_ROOM);
        socket.off(SOCKET_EVENT.ERROR);
        socket.off(SOCKET_EVENT.ERROR_LLM_REQUEST);
      };
    }
  }, [socket, roomInfoState.isMakingQuestions, isLoading]);

  const sendMessage = (chatData?: ChatPlayHistoryType | null) => {
    if (!chatData && roomInfoState.gptTurnType === 'Single') {
      showNotification('메시지가 없습니다', 'error');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const messages = chatData
      ? roomInfoState.gptTurnType === 'Single'
        ? [chatData]
        : [...chatPlayChatHistoryState.history, chatData]
      : chatPlayChatHistoryState.history;

    socket.emit(SOCKET_EVENT.RAG_REQUEST, {
      chatbot_id: roomInfoState.checkId as number,
      language: i18n.language,
      body: { messages },
    });

    setChatPlayChatHistoryStreamState((prev: any) => ({
      ...prev,
      isLoading: true,
    }));
  };

  return { socket, sendMessage, isLoading, connectSocketIo };
};

export default useSocketConnection;
