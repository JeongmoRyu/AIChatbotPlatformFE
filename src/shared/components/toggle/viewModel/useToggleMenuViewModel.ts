import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import {
  chatbotIdState as useChatbotIdState,
  isChatbotImageRefresh as useIsChatbotImageRefresh,
  userLoginState as useUserLoginState,
  initialUserLoginState,
} from '@/shared/store/onpromise';
import useOutsideClick from '../model/useOutsideClick';

const useToggleMenuViewModel = () => {
  const [isToggled, setIsToggled] = useState(false);
  const toggleRef = useRef(null);
  const navigate = useNavigate();
  const userLoginState = useRecoilValue(useUserLoginState);
  const resetUserLoginState = useResetRecoilState(useUserLoginState);
  const chatbotId = useRecoilValue(useChatbotIdState);
  const [isChatbotImageRefresh, setIsChatbotImageRefresh] = useRecoilState(useIsChatbotImageRefresh);
  const [imageKey, setImageKey] = useState<string>(`${chatbotId}_${new Date().getTime()}`);

  useEffect(() => {
    if (isChatbotImageRefresh) {
      setImageKey(`${chatbotId}_${new Date().getTime()}`);
      setIsChatbotImageRefresh(false);
    }
  }, [isChatbotImageRefresh]);

  useOutsideClick(toggleRef, () => setIsToggled(false));

  const movePage = () => {
    resetUserLoginState();
    navigate('login');
  };

  return {
    isToggled,
    setIsToggled,
    toggleRef,
    imageKey,
    movePage,
    userLoginState,
    initialUserLoginState,
  };
};

export default useToggleMenuViewModel;
