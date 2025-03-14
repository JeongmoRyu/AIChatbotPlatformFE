import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { usePageAIChatModel } from '../models/usePageAIChatModel';
import Conversations from '../view/partials/Conversations';
import ConversationSetup from '../view/partials/ConversationSetup';
import { connectionInfoState as useConnectionInfoStore } from '@/shared/store/userinfo';
import { useRecoilValue } from 'recoil';

export const usePageAIChatViewModel = () => {
  const {
    llmModelList,
    sampleQuestions,
    conversations,
    setConversations,
    socketConnected,
    emit,
    llmDone,
    responseData,
    reconnect,
    needReconnect,
    isProcessing,
    socketEndPoint,
    setSocketEndPoint,
  } = usePageAIChatModel();

  // 현재 선택된 LLM 모델과 질문 상태
  const [selectedModel, setSelectedModel] = useState('hummingbird');
  const [question, setQuestion] = useState('');
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);

  useEffect(() => {
    console.log('isProcessing', isProcessing);
  }, [isProcessing]);

  // 질문 상태를 업데이트하는 함수
  const handleQuestion = useCallback((e: ChangeEvent<HTMLTextAreaElement> | string) => {
    setQuestion(typeof e === 'string' ? e : e.target.value);
  }, []);

  // 대화가 비어 있는지 여부를 확인
  const isIntro = useMemo(() => conversations.length === 0, [conversations]);

  // 조건에 따라 대화 패널 컴포넌트 결정
  const ConversationPanel = useMemo(() => (isIntro ? ConversationSetup : Conversations), [isIntro]);

  // 사용자 입력을 conversations에 추가
  const appendUserConversation = useCallback(() => {
    if (!question) return;
    setConversations((prev) => [...prev, { role: 'user', content: question }]);
  }, [question, setConversations]);

  // LLM 응답 요청
  const requestLLM = useCallback(
    (prompt: string) => {
      if (!socketConnected) return;
      const selectedModelData = llmModelList.find((model) => model.id === selectedModel);

      if (selectedModelData) {
        if (selectedModelData.category === 'maum') {
          emit({ language: 'ko', prompt });
        } else {
          emit({ language: 'ko', prompt, selectedModel });
        }
      }
      // emit({ language: 'ko', prompt });
    },
    [emit, socketConnected],
  );

  // conversations 변경 시 LLM 응답 요청
  useEffect(() => {
    if (conversations.length === 0) return;

    const lastConversation = conversations[conversations.length - 1];
    if (lastConversation.role === 'user') {
      setQuestion(''); // 질문 초기화
      requestLLM(lastConversation.content); // LLM에 요청
    }
  }, [conversations, requestLLM]);

  // LLM 모델을 카테고리별로 그룹화
  const groupedLLMModelList = useMemo(() => {
    const list: { maum: any[]; 'third-party': any[] } = {
      maum: [],
      'third-party': [],
    };
    llmModelList.forEach((model) => {
      const target = model.category === 'maum' ? list.maum : list['third-party'];
      target.push({ ...model, isActive: model.id === selectedModel });
    });

    const selectedModelData = llmModelList.find((model) => model.id === selectedModel);

    if (selectedModelData) {
      if (selectedModelData.category === 'maum') {
        setSocketEndPoint(connectionInfoState.aichat.socket);
      } else {
        setSocketEndPoint(`${connectionInfoState.chathub.socket}/llm`);
      }
    }
    console.log(socketEndPoint);
    reconnect();
    return list;
  }, [llmModelList, selectedModel]);

  // LLM 응답을 conversations에 반영
  useEffect(() => {
    if (llmDone || !socketConnected) return;

    setConversations((prev) => {
      if (prev.length === 0) return prev;

      const updated = [...prev];
      const lastConversation = updated[updated.length - 1];

      if (lastConversation.role === 'assistant') {
        updated[updated.length - 1] = { ...lastConversation, content: responseData };
      } else {
        updated.push({ role: 'assistant', content: responseData });
      }

      return updated;
    });
  }, [llmDone, socketConnected, responseData, setConversations]);

  // LLM 응답 완료 후 conversations 최종 업데이트
  useEffect(() => {
    if (!llmDone || !socketConnected || !responseData || needReconnect) return;

    setConversations((prev) => {
      if (prev.length === 0) return prev;

      const updated = [...prev];
      const lastConversation = updated[updated.length - 1];

      if (lastConversation.role === 'assistant') {
        updated[updated.length - 1] = { ...lastConversation, content: responseData };
      } else {
        updated.push({ role: 'assistant', content: responseData });
      }

      return updated;
    });
  }, [llmDone, socketConnected, responseData, needReconnect, setConversations]);

  // 새로운 대화 시작
  const handleNewConversation = useCallback(() => {
    setQuestion(''); // 질문 초기화
    setConversations([]); // 대화 초기화
    reconnect(); // 소켓 재연결
  }, [reconnect, setConversations]);

  return {
    llmModelList,
    sampleQuestions,
    selectedModel,
    setSelectedModel,
    question,
    setQuestion: handleQuestion,
    conversations,
    setConversations,
    isIntro,
    ConversationPanel,
    handleConversations: appendUserConversation,
    groupedLLMModelList,
    socketConnected,
    requestLLM,
    llmDone,
    handleNewConversation,
    reconnect,
    isProcessing,
  };
};
