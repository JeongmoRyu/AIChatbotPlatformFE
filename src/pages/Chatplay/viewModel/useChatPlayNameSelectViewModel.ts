import React, { useEffect } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';

import {
  roomInfoStateChatplay as useRoomInfoState,
  ChatPlayChatHistoryState as useChatPlayChatHistoryStore,
  ChatPlayChatHistoryStreamState as useChatPlayChatHistoryStreamStore,
  ChatPlayChatTimelineState as useChatPlayChatTimelineStore,
  chatPlayTabInfoState,
  selectedQuestion as useSelectedQuestion,
  // isChatLoading,
} from '@/shared/store/chatplay';

const useChatPlayNameSelectViewModel = () => {
  const [roomInfoState, setRoomInfoState] = useRecoilState(useRoomInfoState);

  const resetChatPlayChatHistoryState = useResetRecoilState(useChatPlayChatHistoryStore);
  const resetChatPlayChatTimelineState = useResetRecoilState(useChatPlayChatTimelineStore);
  const resetChatPlayChatHistoryStreamState = useResetRecoilState(useChatPlayChatHistoryStreamStore);
  const resetTabInfoState = useResetRecoilState(chatPlayTabInfoState);
  const resetSelectedQuestion = useResetRecoilState(useSelectedQuestion);

  // const [, setIsLoading] = useRecoilState<boolean>(isChatLoading);

  useEffect(() => {
    // setIsLoading(false);
    resetChatPlayChatHistoryState();
    resetChatPlayChatTimelineState();
    resetChatPlayChatHistoryStreamState();
    resetTabInfoState();
    resetSelectedQuestion();

    setRoomInfoState({ ...roomInfoState, gptTurnType: 'Single' });
  }, [roomInfoState.checkId]);

  const handleOnClickChatbot = (e: React.MouseEvent<HTMLButtonElement>) => {
    const clickedId = parseInt(e.currentTarget.dataset.value || '0', 10);
    // console.log('clickedId', e.currentTarget.dataset.value);
    setRoomInfoState({ ...roomInfoState, checkId: clickedId });
  };

  return { handleOnClickChatbot };
};

export default useChatPlayNameSelectViewModel;
