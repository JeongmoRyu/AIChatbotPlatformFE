import { useEffect, useRef } from 'react';

import { useRecoilValue } from 'recoil';

import {
  ChatPlayChatHistoryState as useChatPlayChatHistoryStore,
  ChatPlayChatTimelineState as useChatPlayChatTimelineStore,
} from '@/shared/store/chatplay';

const useChatPlayTestLogViewModel = () => {
  const refPipeLineSideScroll = useRef<HTMLDivElement>(null);
  const ChatPlayChatHistoryState = useRecoilValue(useChatPlayChatHistoryStore);
  const ChatPlayChatTimelineState = useRecoilValue(useChatPlayChatTimelineStore);

  console.log('ChatPlayChatHistoryState', ChatPlayChatHistoryState);
  console.log('ChatPlayChatTimelineState', ChatPlayChatTimelineState);

  useEffect(() => {
    if (refPipeLineSideScroll && refPipeLineSideScroll.current) {
      refPipeLineSideScroll.current.scrollTop = refPipeLineSideScroll.current.scrollHeight;
    }
  }, [ChatPlayChatTimelineState]);

  return { ChatPlayChatHistoryState, ChatPlayChatTimelineState, refPipeLineSideScroll };
};

export default useChatPlayTestLogViewModel;
