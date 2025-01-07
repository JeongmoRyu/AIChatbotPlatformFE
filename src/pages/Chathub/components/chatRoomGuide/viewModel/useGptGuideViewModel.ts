import {
  GuideInfo as useGuideInfo,
  gptChatHistoryState as useGptChatHistoryStore,
  sequenceQuestionState as useSequenceQuestions,
  isMakingQuestions as useIsMakingQuestions,
  chatbotIdState as useChatbotIdState,
} from '@/shared/store/onpromise';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import useSendPromptData from '@/shared/hooks/useSendPromptData';
import { connectionInfoState as useConnectionInfoStore } from '@/shared/store/userinfo';

const useGPTGuideViewModel = () => {
  const navigate = useNavigate();
  const GuideInfo = useRecoilValue(useGuideInfo);
  const { createNewChatRoom } = useSendPromptData();
  const isMakingQuestions = useRecoilValue(useIsMakingQuestions);
  const chatbotIdState = useRecoilValue(useChatbotIdState);
  const resetGptChatHistoryStore = useResetRecoilState(useGptChatHistoryStore);
  const resetSequenceQuestions = useResetRecoilState(useSequenceQuestions);
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);

  const handleSelectCardQuestion = (question: string) => {
    console.log(`질문 : `, question);
    navigate(`/chatroom/${chatbotIdState}`);
    resetGptChatHistoryStore();
    resetSequenceQuestions();
    setTimeout(() => {
      if (question !== '') {
        createNewChatRoom(question);
      }
    }, 300);
    // if (question !== '') {
    //   createNewChatRoom(question);
    // }
  };

  return { GuideInfo, connectionInfoState, handleSelectCardQuestion, isMakingQuestions };
};

export default useGPTGuideViewModel;
