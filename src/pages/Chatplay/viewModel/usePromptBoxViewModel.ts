import { useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { debounce } from 'lodash';

import useSendPromptData from '../viewModel/useSendPromptData';

import { showNotification } from '@/shared/utils/common-helper';
import {
  roomInfoStateChatplay as useRoomInfoState,
  ChatPlayChatHistoryState as useChatPlayChatHistoryStore,
  isChatLoading,
} from '@/shared/store/chatplay';
import { userLoginState as useUserLoginStore } from '@/shared/store/onpromise';

const usePromptBoxViewModel = (sendMessage: (data: ChatPlayHistoryType | null) => void) => {
  const { handleSendChatData, requestText, setRequestText, containerStyle, setContainerStyle, checkUserChatData } =
    useSendPromptData(sendMessage);

  const [roomInfoState, setRoomInfoState] = useRecoilState(useRoomInfoState);
  const refChatContainer = useRef<HTMLDivElement>(null);
  const refChatBox = useRef<HTMLTextAreaElement>(null);
  const refRowCount = useRef<number>(0);
  const [selectedInput, setSelectedInput] = useState<string>('keyboard');
  const userLoginState = useRecoilValue(useUserLoginStore);

  const isEditable = roomInfoState.state === 'EDITABLE';
  const [chatPlayChatHistoryState, setChatPlayChatHistoryState] = useRecoilState(useChatPlayChatHistoryStore);
  const [buttonText, setButtonText] = useState<string>('User');
  const isVisible = chatPlayChatHistoryState.history.length > 0 && roomInfoState.gptTurnType === 'Multi';

  const isLoading = useRecoilValue<boolean>(isChatLoading);

  const isChatDisabled = !roomInfoState.checkId || roomInfoState.checkId === 'create_option';

  const handleOnClickInputBtn = (e: React.MouseEvent<HTMLButtonElement | HTMLInputElement>) => {
    const currentName = e.currentTarget.name;
    setSelectedInput(currentName);
  };

  const debouncedNotification = debounce((message: string) => {
    showNotification(message, 'error');
  }, 1000);

  const checkValidation = () => {
    if (isChatDisabled) {
      debouncedNotification('챗봇을 먼저 생성해주세요.');
      return false;
    }
    if (!userLoginState.accessToken) {
      showNotification('로그인이 필요한 서비스입니다', 'error');
      return false;
    }

    return true;
  };

  const handleOnChangeChat = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!checkValidation()) return;

    const chatData = e.currentTarget.value;
    const count = chatData.split('\n').length - 1;

    if (refRowCount.current !== count) {
      refRowCount.current = count;
      const curHeight = 66 + 16 * refRowCount.current + 'px';
      setContainerStyle((prev) => ({
        ...prev,
        height: curHeight,
      }));
    }

    if (chatData === '') {
      refRowCount.current = 0;
      setContainerStyle({});
    }
    setRequestText(chatData);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter') {
      if (isLoading) return;
      handleSendMessage(e);
      return;
    }
    if (e.key === 'Enter' && refChatBox.current) {
      refChatBox.current.value + `\n*`;
      return false;
    } else if (e.shiftKey && e.key === 'Enter' && refChatBox.current) {
      refChatBox.current.value + `\n*`;
      return false;
    }

    if (e.shiftKey && e.key === 'Enter') {
      if (refRowCount.current < 8) {
        refRowCount.current += 1;
        const curHeight = 66 + 16 * refRowCount.current + 'px';
        setContainerStyle((prev) => ({
          ...prev,
          height: curHeight,
        }));
      }
      setRequestText(requestText + '\n');
      e.preventDefault();
    } else if (e.key === 'Enter') {
      e.preventDefault();

      if (isLoading) return;
      checkUserChatData();
    }
  };

  const handleOnClickEdit = () => {
    if (isEditable) {
      setRoomInfoState((prev) => ({
        ...prev,
        state: 'UNEDITABLE',
      }));
    } else {
      setRoomInfoState((prev) => ({
        ...prev,
        state: 'EDITABLE',
      }));
    }
  };

  const handleClickGptTurnType = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const name = e.currentTarget.name as 'Single' | 'Multi';

    if (!name) return;

    if (checkUserEmail(userLoginState.email)) {
      showNotification('챗봇 타입을 변경할 권한이 없습니다.', 'error');
    } else {
      setRoomInfoState((prev) => ({
        ...prev,
        state: name === 'Single' ? 'UNEDITABLE' : prev.state,
        gptTurnType: name,
      }));
    }
  };

  const handleChatMode = () => {
    if (buttonText === 'User') {
      setButtonText('Assistant');
    } else {
      setButtonText('User');
    }
  };

  const handleChatHistory = () => {
    const chatData: ChatPlayHistoryType = {
      role: buttonText.toLowerCase(),
      content: requestText,
    };
    console.log('chatData', chatData);
    setChatPlayChatHistoryState((prev) => ({
      ...prev,
      history: [...prev.history, chatData],
    }));
    console.log('chatPlayChatHistoryState', chatPlayChatHistoryState);
    setRequestText('');
    if (buttonText === 'User') {
      setButtonText('Assistant');
    } else {
      setButtonText('User');
    }
  };

  const checkUserEmail = (email: string): boolean => {
    const arrEmail = email.split('@');
    if (arrEmail && arrEmail.length > 1) {
      if (arrEmail[1] === 'skmagic.com') return true;
    }
    return false;
  };

  const handleSendMessage = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isLoading) return;

    if (!roomInfoState.checkId || roomInfoState.checkId === 'create_option') {
      showNotification('챗봇을 먼저 생성해주세요', 'error');

      return;
    }

    handleSendChatData(e);
  };

  return {
    isVisible,
    isEditable,
    handleOnClickEdit,
    roomInfoState,
    handleClickGptTurnType,
    refChatContainer,
    containerStyle,
    buttonText,
    selectedInput,
    handleOnClickInputBtn,
    handleSendChatData,
    requestText,
    refChatBox,
    handleOnChangeChat,
    handleOnKeyDown,
    handleChatHistory,
    handleChatMode,
    handleSendMessage,
    isLoading,
    isChatDisabled,
  };
};

export default usePromptBoxViewModel;
