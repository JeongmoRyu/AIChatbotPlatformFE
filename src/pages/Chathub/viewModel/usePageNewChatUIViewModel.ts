import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRestfulCustomAxios } from '@/shared/hooks/useRestfulCustomAxios';
import { roomStatusState as useRoomStatusState, userLoginState as useUserLoginState } from '@/shared/store/onpromise';
// import ChatSetup from '../view/partials/ChatSetup';
import ChatConversations from '../view/partials/ChatConversations';
import { showNotification } from '@/shared/utils/common-helper';
import ChatSetup from '../view/partials/ChatSetup';
// import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { connectionInfoState as useConnectionInfoStore } from '@/shared/store/userinfo';

export const usePageNewChatUIViewModel = () => {
  type HeaderType = {
    'Content-Type'?: string;
  };

  const location = useLocation();
  const chatbotId = location.state?.id || 2;
  const userLoginState = useRecoilValue(useUserLoginState);
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);
  const [roomStatusState, setRoomStatusState] = useRecoilState(useRoomStatusState);
  const resetRoomStatusState = useResetRecoilState(useRoomStatusState);
  const userName = useMemo(() => userLoginState?.email, [userLoginState]);

  // chatbotId를 가지고 와서 시작
  // 임시 챗봇 2로 시작
  // 신규 채팅 로직
  // 1. chatroom이 없고  chathistory.length가 0이면 신규채팅
  // 채팅 시작
  // 2. 챗룸을 생성하고 생성된 챗봇과 챗룸으로 채팅 시작
  // 3. 채팅 완료 후 추가 질문 생성
  // 4. 추가 질문 생성 완료 후 history 업데이트

  // 히스토리 들어가는 채팅 로직
  // 1. 히스토리 클릭 시 get chat history, chatbot
  // 2. 마지막 질문으로 추가질문 생성
  // 채팅 시작
  // 3. 해당 히스토리 챗룸과 챗봇으로 채팅 시작
  // 4. 채팅 완료 후 추가 질문 생성
  // 5. 추가 질문 생성 완료 후 history 업데이트

  const { sendRequest } = useRestfulCustomAxios();

  const [question, setQuestion] = useState('');
  const [isMakingSeqQuestions, setIsMakingSeqQuestions] = useState<boolean>(false);
  const [sequenceQuestionsList, setSequenceQuestionsList] = useState<IChathubQuestions[]>([]);

  const [streamConversation, setStreamConversation] = useState<string>('');
  const [conversations, setConversations] = useState<IChatHistoryInfo>({
    history: [],
  });

  const isIntro = useMemo(() => conversations.history && conversations.history.length === 0, [conversations]);
  const ConversationPanel = useMemo(() => (isIntro ? ChatSetup : ChatConversations), [isIntro]);

  // leftSidebar
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);

  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const selectedChatroomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    selectedChatroomRef.current = selectedChatroom;
  }, [selectedChatroom]);

  const handleNewConversation = () => {
    console.log('handle New Conversation clicked');
    setQuestion('');
    setConversations({ history: [] });
    setSelectedChatroom(null);
    selectedChatroomRef.current = null;
  };

  const handleDateListChatroomSelect = (index: any) => {
    setSelectedChatroom(index);
    getChatRoomhistorycontent(index);
  };

  const [siderBarOpen, setSiderBarOpen] = useState<boolean>(false);
  const toggleLeftSidebar = () => setLeftSidebarOpen(!leftSidebarOpen);

  // select left sidebar history
  const getChatRoomhistorycontent = async (chatroomid: number) => {
    const response = await sendRequest(`/chatroom/detail/${chatroomid}`, 'get');
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        const data = response.data.data;
        const changedHistory = data.map((item: ChatItem) => ({
          role: item.role,
          content: item.content,
          seq: item.seq,
          room_id: item.room_id,
        }));
        // const list_num = changedHistory.filter((item) => item.role === 'user').length;

        setConversations({ history: changedHistory });
        if (
          conversations.history.length > 0 &&
          conversations.history[conversations.history.length - 1]['role'] === 'assistant'
        ) {
          getSequenceQuestions(chatroomid, conversations.history[conversations.history.length - 1]['seq'] as number);
        }
        // setIsMakingQuestions(true);
      } else {
        showNotification(response.data.message, 'error');
      }
    } else {
      showNotification('채팅 기록 획득에 오류가 발생하였습니다', 'error');
      return;
    }
  };

  const handleChatLog = (chatroomId: number, seqNum: string | number | string[], openSidebar = true) => {
    if (openSidebar) {
      setSiderBarOpen(true);
    }
    getDashboardlogs(chatroomId, seqNum);
  };

  const getDashboardlogs = async (chatroomId: number, seqNum: string | number | string[]) => {
    const response = await sendRequest(`/testlog/${chatroomId}/${seqNum}`, 'get');
    if (response && response.data.data) {
      if (response.data.data.code !== 'F002') {
        setLogData(response.data.data);
      } else {
        showNotification(response.data.message, 'error');
        setSiderBarOpen(false);
      }
    } else {
      showNotification('채팅 로그 획득에 오류가 발생하였습니다', 'error');
      setSiderBarOpen(false);
    }
  };
  // useEffect(() => {
  //   console.log('Sidebar 상태 변경:', siderBarOpen);
  // }, [siderBarOpen]);

  const [logData, setLogData] = useState<IDashBoardLogs>({
    total_time: 0,
    logs: [],
    chatbot_id: 0,
    prompt_1: '',
    prompt_2: '',
  });

  const editChat = () => {
    setSiderBarOpen(false);
  };

  const handleQuestion = useCallback((e: ChangeEvent<HTMLTextAreaElement> | string) => {
    setQuestion(typeof e === 'string' ? e : e.target.value);
  }, []);

  // const appendUserConversation = useCallback(() => {
  //   if (!question) return;
  //   setConversations((prev) => [...prev, { role: 'user', content: question }]);
  // }, [question, setConversations]);

  // 모달
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const [feedbackDetail, setFeedbackDetail] = useState<feedbackContent>({ room_id: 0, seq: 0 });
  const handleFeedbackApi = async (value: string) => {
    console.log(`${value} save`);
    await postFeedbackContent(feedbackDetail.room_id, feedbackDetail.seq, value, userName);
    setIsModalVisible(false);
  };

  const postFeedbackContent = async (chatroom_id: number, seq: number, feedbackContent: string, userName: string) => {
    const response = await sendRequest(
      `/chatroom/feedback/${chatroom_id}/${seq}?feedback=${feedbackContent}&user_name=${userName}`,
      'post',
      undefined,
      undefined,
      undefined,
    );
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        showNotification('피드백 전송에 성공하였습니다.', 'success');
      } else {
        showNotification(response.data.message, 'error');
      }
    } else {
      showNotification('피드백 전송에 오류가 발생하였습니다', 'error');
      return;
    }
  };
  // New Chat Part
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const nowTime: number = new Date().getTime();

  // New Room
  const createNewChatRoom = async (chat: string) => {
    console.log('Creating new chat room with message:', chat);
    try {
      const response = await sendRequest(`/chatroom/${chatbotId}`, 'post', undefined, {});
      if (response && response.data && response.data.result) {
        if (response.data.code !== 'F002') {
          const data = response.data.data;
          if (data && data.id) {
            console.log('Chat room created with ID:', data.id);
            setSelectedChatroom(data.id);
            // setTimeout(() => {
            //   requestAnswerToMCL(chat, data.id, nowTime);
            // }, 300);
            await requestAnswerToMCL(chat, data.id, nowTime);
            return data.id;
          }
        } else {
          showNotification(response.data.message, 'error');
        }
      } else {
        showNotification('새로운 대화방 생성중에 오류가 발생하였습니다', 'error');
      }
    } catch (error) {
      showNotification('새로운 대화방 생성중에 오류가 발생하였습니다', 'error');
    }
    return null;
  };

  // New Chat
  const requestAnswerToMCL = async (userChatData: string, room_id: number, seq_num: number) => {
    setRoomStatusState((prev) => ({ ...prev, state: 'QUESTION' }));
    setSequenceQuestionsList([]);

    if (abortController) {
      abortController.abort();
      console.log('Previous AbortController aborted.');
    }

    const newAbortController = new AbortController();
    setAbortController(newAbortController);
    console.log('New AbortController created:', newAbortController);

    console.log('Sending message to room:', room_id, 'Message:', userChatData);

    if (userChatData !== '') {
      try {
        const response = await sendRequestPromptData(
          `/agentchat/${chatbotId}/${room_id}`,
          'post',
          undefined,
          newAbortController,
          [
            {
              role: 'user',
              content: userChatData,
              seq: seq_num,
            },
          ],
          room_id,
        );

        await getSequenceQuestions(room_id, seq_num);
        setRoomStatusState((prev) => ({ ...prev, state: 'READY' }));
        return response;
      } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'name' in error && (error as Error).name === 'AbortError') {
          setAbortController(null);
          console.log('Request was aborted');
        } else {
          console.error('Error sending message:', error);
          showNotification('대화 요청 중 오류가 발생하였습니다', 'error');
        }
      } finally {
        setAbortController(null);
        setRoomStatusState((prev) => ({
          ...prev,
          chatUiState: 'FINISH',
          state: 'READY',
        }));
        setStreamConversation('');
      }
    }
    return null;
  };

  const restfulHeader = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${userLoginState.accessToken}`,
  };

  const sendRequestPromptData = (
    url: string,
    method: 'post' | 'get' | 'put' | 'patch' | 'delete' = 'post',
    headers: HeaderType = restfulHeader,
    abortController: AbortController,
    data?: any,
    roomId?: any,
  ): Promise<any> => {
    const baseURL = connectionInfoState.chathub.restful;
    const requestOptions = {
      method: method,
      headers: headers,
      body: JSON.stringify(data),
      responseType: 'stream',
      signal: abortController.signal,
    };

    const fetchWithTimeout = (url: string, options: RequestInit, timeout: number = 180000): Promise<Response> => {
      return Promise.race([
        fetch(url, options),
        new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
      ]);
    };

    const responseData = fetchWithTimeout(baseURL + url, requestOptions)
      .then(async (responseData) => {
        if (responseData && responseData.body) {
          const reader = responseData.body.getReader();
          if (reader) {
            let answer = '';
            let temp = '';
            while (true) {
              const { value, done } = await reader.read();
              if (done) {
                console.log('The stream was closed!');
                console.log(roomId, selectedChatroom);
                let ChatPlayAnswer: string = '';
                ChatPlayAnswer = answer;
                console.log(`Z***************************${roomId}************************`);
                console.log(`Z***************************${selectedChatroomRef.current}************************`);

                if (roomId === selectedChatroomRef.current) {
                  const history: IChatHistoryType = {
                    role: 'assistant',
                    content: ChatPlayAnswer,
                    seq: nowTime,
                    room_id: roomId,
                  } as IChatHistoryType;

                  setConversations((prev) => ({
                    ...prev,
                    history: [...prev.history, history],
                  }));
                  console.log('Response added to conversation history');
                } else {
                  console.log('Response discarded: room_id mismatch', {
                    selectedChatroom,
                  });
                }
                // const history: IChatHistoryType = {
                //   role: 'assistant',
                //   content: ChatPlayAnswer,
                //   seq: nowTime,
                //   room_id: selectedChatroom,
                // };
                // setConversations((prev) => ({
                //   ...prev,
                //   history: [...prev.history, history],
                // }));
                return responseData;
              } else {
                const parseData: any = new TextDecoder('utf-8').decode(value);
                console.log('parseData: ', parseData);
                if (parseData && !parseData.includes('|🤖Pong!|')) {
                  // const cleanedData = parseData.replaceAll('"', '');
                  const cleanedData = parseData.replaceAll('"', '').replaceAll('~', '-').replaceAll('~~', '-');
                  temp += cleanedData;
                  if (temp.length > 0) {
                    answer += temp;
                    setStreamConversation(answer);
                    temp = '';
                  }
                }
              }
            }
          }
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          setAbortController(null);
          // abortControllerRef.current = null;
          console.log('Request was aborted');
        } else {
          console.error('Error:', err);
        }
        console.log(err.message);
        return null;
      })
      .finally(() => {
        setAbortController(null);
        // abortControllerRef.current = null;
        setRoomStatusState((prev) => ({
          ...prev,
          chatUiState: 'FINISH',
          state: 'READY',
        }));
        setStreamConversation('');
        // setIsMakingQuestions(true);
      });

    return responseData;
  };

  // const parseResponseData = (responseData: any): string => {
  //   let answer: string = '';
  //   if (responseData) {
  //     if (Array.isArray(responseData)) {
  //       if (responseData[0].text !== '') {
  //         answer = responseData[0].text;
  //       }
  //     }
  //   }
  //   return answer;
  // };

  const getSequenceQuestions = async (room_id: number, seq_num: number) => {
    try {
      setIsMakingSeqQuestions(true);
      setSequenceQuestionsList([]);

      const response = await sendRequest(`/suggest/question/${chatbotId}/${room_id}/${seq_num}`, 'post');

      if (response && response.data) {
        if (response.data.code !== 'F002') {
          const data = response.data.data;
          setSequenceQuestionsList(data);
        } else {
          showNotification(response.data.message, 'error');
        }
      } else {
        showNotification('추가 채팅 생성에 오류가 발생하였습니다', 'error');
      }
    } catch (error) {
      console.error('Error generating sequence questions:', error);
      showNotification('추가 채팅 생성에 오류가 발생하였습니다', 'error');
    } finally {
      setIsMakingSeqQuestions(false);
    }
  };

  const handleSendMessage = async () => {
    if (!question.trim()) return;

    const nowTime = Date.now();
    const currentQuestion = question;
    setQuestion('');

    setConversations((prev) => ({
      ...prev,
      history: [
        ...prev.history,
        {
          role: 'user',
          content: currentQuestion,
          seq: nowTime,
          room_id: selectedChatroom ? selectedChatroom : '',
        } as IChatHistoryType,
      ],
    }));

    if (conversations.history.length === 0 && !selectedChatroom) {
      await createNewChatRoom(currentQuestion);
    } else {
      const roomId = selectedChatroom;
      // const roomId = selectedChatroom
      // ? selectedChatroom
      // : conversations.history.length > 0
      //   ? conversations.history[0].room_id
      //   : null;

      if (roomId) {
        await requestAnswerToMCL(currentQuestion, roomId, nowTime);
      } else {
        console.error('No room ID available');
        showNotification('대화 요청을 처리할 수 없습니다', 'error');
      }
    }
  };

  // StopStream 함수
  const stopStream = () => {
    console.log('stopStream');
    if (abortController) {
      console.log('Stopping stream...');
      abortController.abort();
      setAbortController(null);
      setRoomStatusState((prev) => ({
        ...prev,
        chatUiState: 'FINISH',
        state: 'READY',
      }));
      setStreamConversation('');
    } else {
      console.log('No active AbortController to stop');
    }
  };

  // 처음 시작
  useEffect(() => {
    setConversations({ history: [] });
    setSelectedChatroom(null);
    // setSiderBarOpen(false);
  }, []);

  return {
    ConversationPanel,
    question,
    setQuestion: handleQuestion,
    // handleConversations: appendUserConversation,
    // refChatlist,
    setConversations,
    conversations,
    logData,
    siderBarOpen,
    handleChatLog,
    editChat,
    leftSidebarOpen,
    toggleLeftSidebar,
    isMakingSeqQuestions,
    sequenceQuestionsList,
    isModalVisible,
    setIsModalVisible,
    handleModalClose,
    handleFeedbackApi,
    selectedChatroom,
    setSelectedChatroom,
    handleDateListChatroomSelect,

    setStreamConversation,
    streamConversation,
    handleSendMessage,
    feedbackDetail,
    setFeedbackDetail,
    selectedChatroomRef,
    handleNewConversation,
  };
};
