import React, { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import {
  ChatPlayChatTimelineState,
  ChatPlayChatLinkUrlState as useChatPlayChatLinkUrlStore,
  roomInfoStateChatplay as useRoomInfoState,
  ChatPlayChatHistoryState as useChatPlayChatHistoryStore,
} from '@/shared/store/chatplay';

const useChatPlayGptChatViewModel = () => {
  const [ChatPlayChatLinkUrlState] = useRecoilState(useChatPlayChatLinkUrlStore);
  const chatPlayChatTimelineState = useRecoilValue(ChatPlayChatTimelineState);
  const roomInfo = useRecoilValue(useRoomInfoState);
  const setChatPlayChatHistoryState = useSetRecoilState(useChatPlayChatHistoryStore);
  // const [isOpenAccordion, setIsOpenAccordion] = useState<{ [key: number]: boolean }>({});
  const [isOpenAccordion, setIsOpenAccordion] = useState<boolean[]>([]);

  const handleClickEvent = (e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const url = e.currentTarget.dataset.url;
    window.open(url, '_blank');
  };

  const toggleAccordion = (index: number) => {
    // setIsOpenAccordion((prev) => ({
    //   ...prev,
    //   [index]: !prev[index],
    // }));

    setIsOpenAccordion((prev) => {
      const updatedState = [...prev];
      updatedState[index] = !updatedState[index];
      return updatedState;
    });
  };

  const handleDeleteIcon = (index: number) => {
    setChatPlayChatHistoryState((prev: any) => ({
      ...prev,
      history: prev.history.filter((_: any, i: number) => i !== index),
    }));
  };

  return {
    chatPlayChatTimelineState,
    isOpenAccordion,
    toggleAccordion,
    handleClickEvent,
    roomInfo,

    ChatPlayChatLinkUrlState,
    handleDeleteIcon,
  };
};

export default useChatPlayGptChatViewModel;
