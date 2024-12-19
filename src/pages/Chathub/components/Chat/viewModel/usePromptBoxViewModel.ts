// PromptBoxViewModel.ts
import { useState, useRef, CSSProperties } from 'react';
import { useRecoilValue } from 'recoil';
import {
  roomStatusState as useRoomStatusState,
  isMakingQuestions as useIsMakingQuestions,
} from '@/shared/store/onpromise';
import { showNotification } from '@/shared/utils/common-helper';
import useSendPromptData from '@/shared/hooks/useSendPromptData';

const usePromptBoxViewModel = () => {
  const { checkChatUiState } = useSendPromptData();
  const [requestPrompt, setRequestPrompt] = useState<string>('');
  const [promptBoxStyle, setPromptBoxStyle] = useState<CSSProperties>({});
  const roomStatusState = useRecoilValue(useRoomStatusState);
  const isMakingQuestions = useRecoilValue(useIsMakingQuestions);
  const refRowCount = useRef<number>(0);

  const handleOnChangeChat = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const chatData = e.target.value;
    updatePromptBoxStyle(chatData);
    setRequestPrompt(chatData);
  };

  const updatePromptBoxStyle = (chatData: string) => {
    const count = chatData.split('\n').length - 1;
    if (refRowCount.current !== count) {
      refRowCount.current = count;
      const curHeight = 66 + 16 * refRowCount.current + 'px';
      setPromptBoxStyle({ height: curHeight });
    }
    if (chatData === '') {
      refRowCount.current = 0;
      setPromptBoxStyle({ height: '64px' });
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log('handleOnKeyDown');
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (requestPrompt.trim()) {
        checkChatUiState(requestPrompt);
        setRequestPrompt('');
      }
    }
  };

  const handleClickSendRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('handleClickSendRequest', requestPrompt);
    e.preventDefault();
    if (!requestPrompt.trim()) {
      showNotification('질문 또는 요청할 데이터가 존재하지 않습니다', 'error');
      return;
    }
    checkChatUiState(requestPrompt);
    setRequestPrompt('');
  };

  return {
    requestPrompt,
    promptBoxStyle,
    roomStatusState,
    isMakingQuestions,
    handleOnChangeChat,
    handleOnKeyDown,
    handleClickSendRequest,
  };
};

export default usePromptBoxViewModel;
