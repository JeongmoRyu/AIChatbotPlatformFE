import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import {
  gptChatHistoryStreamState as useGptChatHistoryStreamStore,
  gptChatHistoryState as useGptChatHistoryStore,
  roomInfoState as useRoomInfoState,
  roomStatusState as useRoomStatusState,
  ChathubChatTimelineState as useChathubChatTimelineStore,
  sequenceQuestionState,
  isMakingQuestions as useIsMakingQuestions,
  chatbotIdState as useChatbotIdState,
  userAuthority as useUserAuthority,
} from '@/shared/store/onpromise';
import { showNotification } from '@/shared/utils/common-helper';
import { useRestfulCustomAxios } from '@/shared/hooks/useRestfulCustomAxios';
import useSendPromptData from '@/shared/hooks/useSendPromptData';
import useGetSequenceQuestions from '@/shared/hooks/useGetSequenceQuestions';
import { useNavigate } from 'react-router-dom';
import { connectionInfoState as useConnectionInfoStore } from '@/shared/store/userinfo';
// import useLayoutChathubViewModel from '@/shared/layouts/LayoutChathub/viewModel/useLayoutChathubViewModel';

const usePageChatUIViewModel = () => {
  // const { isOpen, setIsOpen, logData } = useLayoutChathubViewModel();
  const refChatlist = useRef<HTMLDivElement>(null);
  const [selectedChatHistory, setSelectedChatHistory] = useState<number | null>(0);
  const [openFeedbackArea, setOpenFeedbackArea] = useState<Record<number, boolean>>({});
  const { sendRequest } = useRestfulCustomAxios();
  const [gptChatHistoryState, setGptChatHistoryState] = useRecoilState(useGptChatHistoryStore);
  const [isMakingQuestions] = useRecoilState(useIsMakingQuestions);
  const [gptChatHistoryStreamState] = useRecoilState(useGptChatHistoryStreamStore);
  const resetChathubChatTimelineState = useResetRecoilState(useChathubChatTimelineStore);
  const [roomInfoState, setRoomInfoState] = useRecoilState(useRoomInfoState);
  const [roomStatusState, setRoomStatusState] = useRecoilState(useRoomStatusState);
  const sequenceQuestionsList = useRecoilValue(sequenceQuestionState);
  const resetSequenceQuestions = useResetRecoilState(sequenceQuestionState);
  // const resetGptChatHistroyState = useResetRecoilState(useGptChatHistoryStore);
  const { requestAnswerToMCL } = useSendPromptData();
  const { getSequenceQuestions } = useGetSequenceQuestions();

  const navigate = useNavigate();
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);
  const chatbotIdState = useRecoilValue(useChatbotIdState);
  const chatbotImage = `${connectionInfoState.chathub.restful}/chatbotinfo/image/${chatbotIdState}`;
  const userAuthority = useRecoilValue(useUserAuthority);

  useEffect(() => {
    resetSequenceQuestions();
    return () => {
      console.log('*** Unmount Reset ***');
      // resetGptChatHistroyState();
      // mvvn으로 변동 후 error 발생하여 주석처리함
      resetChathubChatTimelineState();
    };
  }, []);

  useEffect(() => {
    if (gptChatHistoryState && gptChatHistoryState.history.length > 0) {
      if (refChatlist && refChatlist.current) {
        refChatlist.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // console.log('*** reset GptHistory ***');
    }
  }, [gptChatHistoryState, gptChatHistoryStreamState]);

  const handleSelectQuestion = (question: string) => {
    const nowTime: number = new Date().getTime();

    requestAnswerToMCL(question, roomInfoState.roomId, nowTime);

    setGptChatHistoryState((prev) => {
      // const userMessagesCount = prev.history.filter((item) => item.role === 'user').length;

      return {
        ...prev,
        history: [
          ...prev.history,
          {
            role: 'user',
            content: question,
            seq: nowTime,
          },
        ],
      };
    });
    setRoomStatusState((prev) => ({
      ...prev,
      chatUiState: 'ING',
    }));
  };
  const handleSelectChatHistory = (index: number) => {
    setRoomInfoState((prev) => ({
      ...prev,
      roomId: index,
    }));
    setSelectedChatHistory(index);
    getChatRoomhistorycontent(index);
    setOpenFeedbackArea({});
    resetChathubChatTimelineState();
  };

  const handleFeedbackArea = (index: number) => {
    setOpenFeedbackArea((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getChatRoomhistorycontent = async (chatroomid: number) => {
    const response = await sendRequest(`/chatroom/detail/${chatroomid}`, 'get');
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        const data = response.data.data;
        const changedHistory = data.map((item: IChatItem) => ({
          role: item.role,
          content: item.content,
          seq: item.seq,
        }));
        // const list_num = changedHistory.filter((item) => item.role === 'user').length;

        setGptChatHistoryState({ history: changedHistory });
        if (
          gptChatHistoryState.history.length > 0 &&
          gptChatHistoryState.history[gptChatHistoryState.history.length - 1]['role'] === 'assistant'
        ) {
          getSequenceQuestions(
            chatroomid,
            gptChatHistoryState.history[gptChatHistoryState.history.length - 1]['seq'] as number,
          );
        }
        // setIsMakingQuestions(true);
      } else {
        showNotification(response.data.message, 'error');
        navigate('/login');
      }
    } else {
      showNotification('채팅 기록 획득에 오류가 발생하였습니다', 'error');
      return;
    }
  };
  const editChat = (isShow: boolean) => {
    // setIsOpen(!isOpen);
    setSiderBarOpen(isShow);
    activeSideTab === 'testlog' && setActiveSideTab('setting');
  };

  // Asis로 개발 원복
  const [siderBarOpen, setSiderBarOpen] = useState<boolean>(false);
  const [activeSideTab, setActiveSideTab] = useState<'setting' | 'testlog'>('setting');
  const handleChatLog = (chatroomId: number, seqNum: string | number | string[]) => {
    getDashboardlogs(chatroomId, seqNum);
    !siderBarOpen && setSiderBarOpen(true);
    activeSideTab === 'setting' && setActiveSideTab('testlog');
  };
  const getDashboardlogs = async (chatroomId: number, seqNum: string | number | string[]) => {
    const response = await sendRequest(`/testlog/${chatroomId}/${seqNum}`, 'get');
    if (response && response.data.data) {
      if (response.data.data.code !== 'F002') {
        setLogData(response.data.data);
      } else {
        showNotification(response.data.message, 'error');
        navigate('/login');
      }
    } else {
      showNotification('채팅 로그 획득에 오류가 발생하였습니다', 'error');
    }
  };
  const [logData, setLogData] = useState<IDashBoardLogs>({
    total_time: 0,
    logs: [],
    chatbot_id: 0,
    prompt_1: '',
    prompt_2: '',
  });

  return {
    editChat,
    chatbotImage,
    handleSelectChatHistory,
    selectedChatHistory,
    gptChatHistoryState,
    userAuthority,
    roomInfoState,
    handleFeedbackArea,
    openFeedbackArea,
    roomStatusState,
    gptChatHistoryStreamState,
    refChatlist,
    isMakingQuestions,
    sequenceQuestionsList,
    handleSelectQuestion,
    logData,
    activeSideTab,
    setActiveSideTab,
    siderBarOpen,
    handleChatLog,
  };
};
export default usePageChatUIViewModel;
