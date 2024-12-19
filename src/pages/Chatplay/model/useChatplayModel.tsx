import React, { useEffect, useLayoutEffect } from 'react';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';

import useSocketConnection from '../hooks/useSocketConnection';

import {
  chatbotDataChatPlay as useChatbotData,
  ChatPlayChatHistoryState as useChatPlayChatHistoryStore,
  selectedQuestion as useSelectedQuestion,
  roomInfoStateChatplay as useRoomInfoState,
} from '@/shared/store/chatplay';
import { userLoginState } from '@/shared/store/onpromise';
import useFetchChatplay from '../hooks/useFetchChatplay';

const useChatplayModel = () => {
  const { socket, sendMessage, connectSocketIo } = useSocketConnection();
  // console.log('useChatplayModel');

  const { getChatbotData } = useFetchChatplay();

  const userLoginInfo = useRecoilValue(userLoginState);

  const ChatPlayChatHistoryState = useRecoilValue(useChatPlayChatHistoryStore);

  const setSelectedQuestion = useSetRecoilState(useSelectedQuestion);
  const setChatbotData = useSetRecoilState(useChatbotData);

  const resetRoomInfoState = useResetRecoilState(useRoomInfoState);
  const roomInfoState = useRecoilValue(useRoomInfoState);

  const handleOnClickTopic = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const innerText = e.currentTarget.innerText;
    if (innerText) {
      setSelectedQuestion(innerText);
    }
  };

  useLayoutEffect(() => {
    if (userLoginInfo.accessToken) {
      connectSocketIo();
    }
    return () => {
      if (socket) {
        resetRoomInfoState();
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (roomInfoState.checkId === 'create_option') {
      connectSocketIo();
    }
    if (typeof roomInfoState.checkId === 'number' && roomInfoState.checkId !== 0) {
      connectSocketIo();
    }
  }, [roomInfoState.checkId]);

  useEffect(() => {
    //처음 로드될 때
    if (!userLoginInfo.accessToken) {
      resetRoomInfoState();
      return;
    } else {
      getChatbotData();
    }

    return () => {
      setChatbotData([]);
    };
  }, [userLoginInfo.accessToken]);

  return { ChatPlayChatHistoryState, sendMessage, socket, handleOnClickTopic };
};

export default useChatplayModel;
