import { showNotification } from '@/shared/utils/common-helper';
import { useRestfulCustomAxios } from './useRestfulCustomAxios';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  sequenceQuestionState,
  // chatbotDiffAdmnin as useChatbotDiffAdmnin,
  isMakingQuestions as useIsMakingQuestions,
  chatbotIdState as useChatbotIdState,
} from '@/shared/store/onpromise';
// import { LOGIN } from 'data/routers';
// import { useNavigate } from 'react-router-dom';

function useGetSequenceQuestions() {
  const { sendRequest } = useRestfulCustomAxios();
  const setSequenceQuestionsList = useSetRecoilState<IChathubQuestions[]>(sequenceQuestionState);
  const chatbotIdState = useRecoilValue(useChatbotIdState);
  // const chatbotDiffAdmnin = useRecoilValue(useChatbotDiffAdmnin);
  const [, setIsMakingQuestions] = useRecoilState(useIsMakingQuestions);
  // const navigate = useNavigate();

  const getSequenceQuestions = async (room_id: number, seq: number): Promise<void> => {
    setSequenceQuestionsList([]);
    setIsMakingQuestions(true);
    const response = await sendRequest(`/suggest/question/${chatbotIdState}/${room_id}/${seq}`, 'post');
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        const data = response.data.data;
        setSequenceQuestionsList(data);
        setIsMakingQuestions(false);
      } else {
        showNotification(response.data.message, 'error');
        setIsMakingQuestions(false);
      }
    } else {
      showNotification('추가 채팅 생성에 오류가 발생하였습니다', 'error');
      setIsMakingQuestions(false);
      return;
    }
  };

  return { getSequenceQuestions };
}

export default useGetSequenceQuestions;
