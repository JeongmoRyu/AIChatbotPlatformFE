import { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';

import {
  ChatPlayChatHistoryState as useChatPlayChatHistoryStore,
  ChatPlayChatHistoryStreamState as useChatPlayChatHistoryStreamStore,
} from '@/shared/store/chatplay';

const useChatPlayChatUIViewModel = () => {
  const ChatPlayChatHistoryState = useRecoilValue(useChatPlayChatHistoryStore);
  const ChatPlayChatHistoryStreamState = useRecoilValue(useChatPlayChatHistoryStreamStore);
  const refScroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (refScroll.current) {
      refScroll.current.scrollTop = refScroll.current.scrollHeight;
    }
  }, [ChatPlayChatHistoryState, ChatPlayChatHistoryStreamState.isLoading, ChatPlayChatHistoryStreamState.answer]);
  return { refScroll, ChatPlayChatHistoryState, ChatPlayChatHistoryStreamState };
};

export default useChatPlayChatUIViewModel;
