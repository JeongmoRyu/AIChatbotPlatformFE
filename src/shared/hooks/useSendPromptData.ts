import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useRestfulCustomAxios } from '@/shared/hooks/useRestfulCustomAxios';
import {
  roomInfoState as useRoomInfoState,
  gptChatHistoryState as useGptChatHistoryStore,
  gptChatHistoryStreamState as useGptChatHistoryStreamStore,
  userLoginState as useUserLoginState,
  chatbotIdState as useChatbotIdState,
  sequenceQuestionState,
  // chatbotDiffAdmnin as useChatbotDiffAdmnin,
  roomStatusState as useRoomStatusState,
} from '@/shared/store/onpromise';
import { showNotification } from '@/shared/utils/common-helper';
import { connectionInfoState as useConnectionInfoStore } from '@/shared/store/userinfo';
import useGetSequenceQuestions from './useGetSequenceQuestions';
// import { LOGIN } from 'data/routers';

type HeaderType = {
  'Content-Type'?: string;
};

function useSendPromptData() {
  const { sendRequest } = useRestfulCustomAxios();
  const navigate = useNavigate();
  const userLoginState = useRecoilValue(useUserLoginState);
  const chatbotIdState = useRecoilValue(useChatbotIdState);
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);
  const [roomInfoState, setRoomInfoState] = useRecoilState(useRoomInfoState);
  const [, setRoomStatusState] = useRecoilState(useRoomStatusState);
  const setGptChatHistoryStreamStore = useSetRecoilState(useGptChatHistoryStreamStore);
  const [gptChatHistoryState, setGptChatHistoryState] = useRecoilState(useGptChatHistoryStore);
  const nowTime: number = new Date().getTime();
  const { getSequenceQuestions } = useGetSequenceQuestions();
  const setSequenceQuestionsList = useSetRecoilState<IChathubQuestions[]>(sequenceQuestionState);

  // // stopStream 함수 추가
  // const stopStream = () => {
  //   console.log('stopStream');
  //   console.log(abortControllerRef.current);
  //   if (abortControllerRef.current) {
  //     console.log('Stopping stream...');
  //     abortControllerRef.current.abort();
  //     abortControllerRef.current = null;
  //     setRoomStatusState((prev) => ({
  //       ...prev,
  //       chatUiState: 'FINISH',
  //       state: 'QUESTION',
  //     }));
  //     setGptChatHistoryStreamStore('');
  //   }
  // };
  const requestAnswerToMCL = async (userChatData: string, room_id: number, seq_num: number) => {
    setRoomInfoState((prev) => ({ ...prev, roomId: room_id }));
    setSequenceQuestionsList([]);
    console.log('***requestAnswerToMCL***', userChatData);
    if (userChatData !== '') {
      const response = await sendRequestPromptData(
        `/chat/${chatbotIdState}/${room_id}?room_id=${roomInfoState.socketId}`,
        'post',
        undefined,
        [
          {
            role: 'user',
            content: userChatData,
            seq: seq_num,
          },
        ],
      );
      await getSequenceQuestions(room_id, seq_num);
      if (response && response.data) {
        console.log(response);
        console.log(gptChatHistoryState);
        if (response.data.code !== 'F002') {
          if (parseResponseData(response.data) != '') {
            const answer = parseResponseData(response.data);
            console.log(answer);
          }
          setRoomStatusState((prev) => ({ ...prev, state: 'QUESTION' }));
          setRoomInfoState((prev) => ({ ...prev, sequence: seq_num }));
        } else {
          showNotification(response.data.message, 'error');
          navigate('/login');
        }
      }
    }
  };

  const parseResponseData = (responseData: any): string => {
    let answer: string = '';
    if (responseData) {
      if (Array.isArray(responseData)) {
        if (responseData[0].text != '') {
          answer = responseData[0].text;
        }
      }
    }
    return answer;
  };

  const restfulHeader = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${userLoginState.accessToken}`,
  };

  const sendRequestPromptData = (
    url: string,
    method: 'post' | 'get' | 'put' | 'patch' | 'delete' = 'post',
    headers: HeaderType = restfulHeader,
    data?: any,
  ): Promise<any> => {
    const baseURL = connectionInfoState.chathub.restful;
    // if (abortControllerRef.current) {
    //   abortControllerRef.current.abort();
    // }
    // abortControllerRef.current = new AbortController();
    const requestOptions = {
      method: method,
      headers: headers,
      body: JSON.stringify(data),
      responseType: 'stream',
      // signal: abortControllerRef.current.signal,
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

                let ChatPlayAnswer: string = '';
                ChatPlayAnswer = answer;

                const history: ChatHistoryType = {
                  role: 'assistant',
                  content: ChatPlayAnswer,
                  seq: nowTime,
                };
                setGptChatHistoryState((prev) => ({
                  ...prev,
                  history: [...prev.history, history],
                }));
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
                    setGptChatHistoryStreamStore(answer);
                    temp = '';
                  }
                }
              }
            }
          }
        }
      })
      .catch((err) => {
        // if (err.name === 'AbortError') {
        //   console.log('Request was aborted');
        // } else {
        //   console.error('Error:', err);
        // }
        console.log(err.message);
        return null;
      })
      .finally(() => {
        // abortControllerRef.current = null;
        setRoomStatusState((prev) => ({
          ...prev,
          chatUiState: 'FINISH',
          state: 'QUESTION',
        }));
        setGptChatHistoryStreamStore('');
        // setIsMakingQuestions(true);
      });

    return responseData;
  };

  const checkChatUiState = async (chatData: string) => {
    const NowPath = window.location.pathname;
    const TargetPath = `/chatroom/${chatbotIdState}`;
    console.log(NowPath);
    console.log(TargetPath);

    if (NowPath === TargetPath && roomInfoState.roomId && roomInfoState.roomId !== 0) {
      setRoomStatusState((prev) => ({ ...prev, chatUiState: 'ING' }));
      addMessageToHistory('user', chatData, nowTime);
    } else {
      if (NowPath !== TargetPath) {
        console.log('새로운 대화방 자동 생성');
        navigate(`/chatroom/${chatbotIdState}`);
        await createNewChatRoom(chatData);
      } else {
        setRoomStatusState((prev) => ({ ...prev, chatUiState: 'ING' }));
        addMessageToHistory('user', chatData, nowTime);
      }
    }
  };

  const addMessageToHistory = (role: string, content: string, seq_num: number) => {
    // console.log("*****imhere*****",window.location.pathname, window.location.search)
    const newMessage = { role, content, seq_num };
    console.log('***addMessageToHistory***', newMessage);
    setGptChatHistoryState((prev) => ({
      ...prev,
      history: [...prev.history, newMessage],
    }));
    setRoomStatusState((prev) => ({ ...prev, state: 'QUESTION' }));
    setRoomInfoState((prev) => ({ ...prev, sequence: seq_num }));

    requestAnswerToMCL(content, roomInfoState.roomId, seq_num);
  };

  const createNewChatRoom = async (chat: string) => {
    console.log('***here is newchatroom***');
    console.log(chat);
    const response = await sendRequest(`/chatroom/${chatbotIdState}`, 'post', undefined, {});

    if (response && response.data && response.data.result) {
      if (response.data.code !== 'F002') {
        const data = response.data.data;
        if (data && data.id) {
          console.log('Before updating GptChatHistoryState:', gptChatHistoryState);

          console.log('대화방 ID: ', data.id);
          setGptChatHistoryState((prev) => {
            return {
              ...prev,
              history: [
                ...prev.history,
                {
                  role: 'user',
                  content: chat,
                  seq: nowTime,
                },
              ],
            };
          });

          setRoomInfoState((prev) => ({
            ...prev,
            roomId: data.id,
            sequence: nowTime,
          }));
          setRoomStatusState((prev) => ({
            ...prev,
            chatUiState: 'ING',
            state: 'CREATED',
          }));
          setTimeout(() => {
            requestAnswerToMCL(chat, data.id, nowTime);
          }, 0);
          // requestAnswerToMCL(chat, data.id, nowTime);
        }
      } else {
        showNotification(response.data.message, 'error');
        navigate('/login');
      }
    } else {
      showNotification('새로운 대화방 생성중에 오류가 발생하였습니다', 'error');
      return;
    }
  };

  return {
    checkChatUiState,
    createNewChatRoom,
    requestAnswerToMCL,
    // stopStream
  };
}

export default useSendPromptData;
