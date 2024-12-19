import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import {
  gptChatHistoryStreamState as useGptChatHistoryStreamStore,
  GuideInfo as useGuideInfo,
  chatbotIdState as useChatbotIdState,
  gptChatHistoryState as useGptChatHistoryStore,
  roomInfoState as useRoomInfoState,
} from '@/shared/store/onpromise';
import { useRestfulCustomAxios } from '@/shared/hooks/useRestfulCustomAxios';
import { showNotification } from '@/shared/utils/common-helper';
import { useSocketConnection } from '@/shared/hooks/useSocketConnection';
import { useNavigate } from 'react-router-dom';

const usePageChatRoomViewModel = () => {
  const resetGptChatHistoryStore = useResetRecoilState(useGptChatHistoryStore);
  const resetGptChatHistoryStreamState = useResetRecoilState(useGptChatHistoryStreamStore);
  const [, setRoomInfoState] = useRecoilState(useRoomInfoState);
  const { sendRequest } = useRestfulCustomAxios();
  const setGuideInfo = useSetRecoilState(useGuideInfo);
  const navigate = useNavigate();
  const chatbotIdState = useRecoilValue(useChatbotIdState);

  useSocketConnection();

  useEffect(() => {
    getChatGuideData();
    return () => {
      setRoomInfoState((prev) => ({
        ...prev,
        roomId: 0,
      }));
      resetGptChatHistoryStreamState();
      resetGptChatHistoryStore();
    };
  }, []);

  const getChatGuideData = async () => {
    const response = await sendRequest(`/chatbot/contents/${chatbotIdState}`, 'get');
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        if (response.data.result) {
          const data = response.data.data;
          setGuideInfo(data);
        } else {
          showNotification('서버에서 정상적으로 받아오지 못했습니다.', 'error');
        }
      } else {
        showNotification(response.data.message, 'error');
        navigate('/login');
      }
    } else {
      showNotification('서버에서 정상적으로 받아오지 못했습니다.', 'error');
      return;
    }
  };
  // return {};
};

export default usePageChatRoomViewModel;
