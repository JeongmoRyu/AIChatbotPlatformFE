import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useOutsideClick from '@/shared/hooks/useOutsideClick';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import {
  gptChatHistoryState as useGptChatHistoryStore,
  roomInfoState as useRoomInfoState,
  chatbotIdState as useChatbotIdState,
  isChatbotImageRefresh as useIsChatbotImageRefresh,
  userAuthority as useUserAuthority,
} from '@/shared/store/onpromise';

const useToggleMenuViewModel = () => {
  const [isToggled, setIsToggled] = useState(false);
  const toggleRef = useRef(null);
  const navigate = useNavigate();
  const resetGptChatHistroyState = useResetRecoilState(useGptChatHistoryStore);
  const [, setRoomInfoState] = useRecoilState(useRoomInfoState);
  const chatbotId = useRecoilValue(useChatbotIdState);
  const [isChatbotImageRefresh, setIsChatbotImageRefresh] = useRecoilState(useIsChatbotImageRefresh);
  const [imageKey, setImageKey] = useState<string>(`${chatbotId}_${new Date().getTime()}`);
  // const chatbotDiffAdmin = useRecoilValue(useChatBotDiffAdmin);
  const userAuthority = useRecoilValue(useUserAuthority);

  useEffect(() => {
    if (isChatbotImageRefresh) {
      setImageKey(`${chatbotId}_${new Date().getTime()}`);
      setIsChatbotImageRefresh(false);
    }
  }, [isChatbotImageRefresh]);

  useOutsideClick(toggleRef, () => setIsToggled(false));

  const moveChatRoom = () => {
    setRoomInfoState((prev) => ({
      ...prev,
      roomId: 0,
    }));
    resetGptChatHistroyState();
    navigate('/chatroom');
  };

  return { setIsToggled, isToggled, toggleRef, userAuthority, imageKey, moveChatRoom };
};

export default useToggleMenuViewModel;
