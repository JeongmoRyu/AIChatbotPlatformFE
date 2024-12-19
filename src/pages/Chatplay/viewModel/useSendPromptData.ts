import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { ChatPlayChatHistoryState, selectedQuestion as useSelectedQuestion } from '@/shared/store/chatplay';

function useSendPromptData(sendMessage: (data: ChatPlayHistoryType | null) => void) {
  const refRequestText = useRef<string>('');
  const [requestText, setRequestText] = useState<string>('');
  const [containerStyle, setContainerStyle] = useState<Object>({});
  const selectedQuestion = useRecoilValue(useSelectedQuestion);
  const setChatPlayChatHistoryState = useSetRecoilState(ChatPlayChatHistoryState);

  useEffect(() => {
    if (selectedQuestion) {
      setRequestText(selectedQuestion);
    } else {
      setRequestText('');
    }
  }, [selectedQuestion]);

  const handleSendChatData = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    checkUserChatData();
  };

  const checkUserChatData = () => {
    if (requestText !== '') {
      refRequestText.current = requestText;
      setRequestText('');

      const history: ChatPlayHistoryType = {
        role: 'user',
        content: refRequestText.current,
      };

      setChatPlayChatHistoryState((prev) => ({
        ...prev,
        history: [...prev.history, history],
      }));
      console.log('HELLO:', history);
      sendMessage(history); //socket
      setContainerStyle({});
    } else {
      sendMessage(null);
    }
  };

  return {
    handleSendChatData,
    requestText,
    setRequestText,
    containerStyle,
    setContainerStyle,
    checkUserChatData,
  };
}
export default useSendPromptData;
