import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSocket } from '@/shared/hooks/useSocket';
import { connectionInfoState as useConnectionInfoStore } from '@/shared/store/userinfo';
import { useRecoilValue } from 'recoil';

interface IChatWithAIRequestData {
  language: 'ko' | 'en';
  prompt: string;
}

interface ChatState {
  isProcessing: boolean;
  response: string;
  error: Error | null;
}

interface ILLMModel {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
}

const SOCKET_EVENTS = {
  RESPONSE_START: 'llm_response_start',
  RESPONSE: 'llm_response',
  RESPONSE_END: 'llm_response_end',
  ERROR: 'error',
} as const;

export const usePageAIChatModel = () => {
  const { i18n } = useTranslation(['aiChat']);

  // 상태 정의
  const [llmModelList, setLLMModelList] = useState<ILLMModel[]>([]);
  const [sampleQuestions, setSampleQuestions] = useState<ISampleQuestionGroup[]>([]);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);

  // ip로 api 호출시
  const { socket, reconnect, needReconnect } = useSocket(connectionInfoState.aichat.socket);
  // env 및 docker로 연결하여 ces 용으로 사용하시면 될 것 같습니다.
  // const { socket, reconnect, needReconnect } = useSocket(`http://${import.meta.env.VITE_CHATPLAY_API_DOMAIN}/llm`);

  const [chatState, setChatState] = useState<ChatState>({
    isProcessing: false,
    response: '',
    error: null,
  });

  const socketConnected = useMemo(() => Boolean(socket), [socket]);

  const startProcessing = useCallback(() => {
    setChatState({ isProcessing: true, response: '', error: null });
  }, []);

  const appendResponse = useCallback((data: string) => {
    setChatState((prev) => ({ ...prev, response: prev.response + data }));
  }, []);

  const finishProcessing = useCallback(() => {
    setChatState((prev) => ({ ...prev, isProcessing: false }));
  }, []);

  const setError = useCallback((error: Error) => {
    setChatState({ isProcessing: false, response: '', error });
  }, []);

  const emit = useCallback(
    (data: IChatWithAIRequestData) => {
      if (!socket) return;
      setChatState((prev) => ({ ...prev, response: '' }));
      socket.emit('llm_request', { language: data.language, prompt: data.prompt });
    },
    [socket],
  );

  useEffect(() => {
    if (!socket) return;

    const onResponseStart = () => startProcessing();
    const onResponse = (data: string) => appendResponse(data);
    const onResponseEnd = () => finishProcessing();
    const onError = (error: Error) => setError(error);

    socket.on(SOCKET_EVENTS.RESPONSE_START, onResponseStart);
    socket.on(SOCKET_EVENTS.RESPONSE, onResponse);
    socket.on(SOCKET_EVENTS.RESPONSE_END, onResponseEnd);
    socket.on(SOCKET_EVENTS.ERROR, onError);

    return () => {
      socket.off(SOCKET_EVENTS.RESPONSE_START, onResponseStart);
      socket.off(SOCKET_EVENTS.RESPONSE, onResponse);
      socket.off(SOCKET_EVENTS.RESPONSE_END, onResponseEnd);
      socket.off(SOCKET_EVENTS.ERROR, onError);
    };
  }, [socket, startProcessing, appendResponse, finishProcessing, setError]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questions = i18n.language === 'ko' ? await fetchSampleQuestionsKO() : await fetchSampleQuestionsEN();

        const modelList = await fetchLLMModelList();

        setLLMModelList(modelList);
        setSampleQuestions(questions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [i18n.language]);

  const handleReconnect = useCallback(() => {
    setChatState({ isProcessing: false, response: '', error: null });
    reconnect();
  }, [reconnect]);

  return {
    llmModelList,
    sampleQuestions,
    conversations,
    setConversations,
    socketConnected,
    emit,
    llmDone: !chatState.isProcessing,
    responseData: chatState.response,
    reconnect: handleReconnect,
    needReconnect,
    isProcessing: chatState.isProcessing,
  };
};

// 서비스 함수들 (현재는 해당 파일에 그대로 두었지만 필요시 별도 파일로 분리 가능)
async function fetchLLMModelList(): Promise<ILLMModel[]> {
  return [
    {
      id: 'hummingbird',
      name: 'Llama3.1 MAAL Hummingbird',
      category: 'maum',
      categoryLabel: '기본 모델',
    },
    // {
    //   id: 'gpt4',
    //   name: 'Chat GPT 4',
    //   category: 'third-party',
    //   categoryLabel: '외부 모델',
    // },
    // {
    //   id: 'gpt4-mini',
    //   name: 'Chat GPT 4 mini',
    //   category: 'third-party',
    //   categoryLabel: '외부 모델',
    // },
  ];
}

async function fetchSampleQuestionsKO(): Promise<ISampleQuestionGroup[]> {
  return [
    {
      type: 'multi',
      count: 2,
      questions: [
        {
          title: 'Knowledge',
          question: '남반구와 북반구의 계절이 다른 이유가 뭔가요?',
        },
        {
          title: 'Knowledge',
          question: '건강한 식습관을 유지하는 방법을 3가지로 정리해주세요.',
        },
      ],
    },
    {
      type: 'single',
      questions: [
        {
          title: 'Writing',
          question: `다음 내용을 포함하는 보고서를 작성해 주세요.
(1) 2024년 가을 과일 가격을 표로 정리해주세요.
(2) 사과 가격 3000원, 배 가격 4000원, 감 가격 2000원
(3) 2024년 가을 수확된 과일에 대해 설명하고, 과일 소비를 장려하는 보고서를 작성해 주세요.`,
        },
      ],
    },
    {
      type: 'single',
      questions: [
        {
          title: 'Translation',
          question: `아래 문장을 한국어로 번역해주세요.
Making language models bigger does not inherently make them better at following a user's intent. For example, large language models can generate outputs that are untruthful, toxic, or simply not helpful to the user. In other words, these models are not aligned with their users.`,
        },
      ],
    },
  ];
}

async function fetchSampleQuestionsEN(): Promise<ISampleQuestionGroup[]> {
  return [
    {
      type: 'multi',
      count: 2,
      questions: [
        {
          title: 'Knowledge',
          question: 'What is the reason why the seasons are different in the Southern and Northern Hemispheres?',
        },
        {
          title: 'Knowledge',
          question: 'Summarize three ways to maintain a healthy eating habit.',
        },
      ],
    },
    {
      type: 'single',
      questions: [
        {
          title: 'Writing',
          question: `Write a report that includes the following:
(1) Summarize the fall 2024 fruit prices in a table.
(2) Apple price 3000 won, Pear price 4000 won, Persimmon price 2000 won.
(3) Explain the fruits harvested in fall 2024 and write a report promoting fruit consumption.`,
        },
      ],
    },
    {
      type: 'single',
      questions: [
        {
          title: 'Translation',
          question: `Translate the following sentence into English.
언어 모델을 더 크게 만드는 것이 본질적으로 사용자의 의도를 더 잘 따르게 만들지는 않습니다. 예를 들어, 대형 언어 모델은 거짓된, 유해한 또는 단순히 사용자에게 도움이 되지 않는 출력을 생성할 수 있습니다. 다시 말해, 이러한 모델은 사용자의 요구와 일치하지 않습니다.`,
        },
      ],
    },
  ];
}
