import { useRecoilValue } from 'recoil';

import {
  chatbotDataChatPlay as useChatbotData,
  roomInfoStateChatplay as useRoomInfoState,
} from '@/shared/store/chatplay';

const useGuideQuestionsViewModel = () => {
  const chatbotData = useRecoilValue(useChatbotData);
  const roomInfoState = useRecoilValue(useRoomInfoState);
  const ChatbotClickedName = chatbotData.find((data) => data.chatbot_id === roomInfoState.checkId)?.name;

  return { ChatbotClickedName };
};

export default useGuideQuestionsViewModel;
