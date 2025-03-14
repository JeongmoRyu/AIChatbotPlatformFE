import React, { useEffect, useLayoutEffect } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';

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

  const { getChatbotData } = useFetchChatplay();

  useEffect(() => {
    console.log('useChatplayModel socket:', socket);
  }, [socket]);

  const userLoginInfo = useRecoilValue(userLoginState);

  const ChatPlayChatHistoryState = useRecoilValue(useChatPlayChatHistoryStore);

  const setSelectedQuestion = useSetRecoilState(useSelectedQuestion);
  const setChatbotData = useSetRecoilState(useChatbotData);

  const resetRoomInfoState = useResetRecoilState(useRoomInfoState);

  const handleOnClickTopic = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const innerText = e.currentTarget.innerText;
    if (innerText) {
      setSelectedQuestion(innerText);
    }
  };

  // useLayoutEffect(() => {
  //   if (userLoginInfo.accessToken && !socket) {
  //     connectSocketIo();
  //   }
  //   return () => {
  //     if (socket && !socket.disconnected) {
  //       resetRoomInfoState();
  //       socket.disconnect();
  //     }
  //   };
  // }, []);

  useLayoutEffect(() => {
    if (!!socket || !userLoginInfo.accessToken) return;
    connectSocketIo();

    return () => {
      if (!socket || socket.disconnected) return;
      console.log('*** ChatPlay Disconnecting Socket ***');
      resetRoomInfoState();
      socket.disconnect();
    };
  }, [socket, userLoginInfo.accessToken]);

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
