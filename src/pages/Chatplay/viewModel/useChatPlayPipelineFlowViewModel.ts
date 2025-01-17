import { findEngineById } from '@/shared/utils/chat-play-helper';
import React, { useEffect, useMemo, useState } from 'react';
import useFetchChatplay from '../hooks/useFetchChatplay';
import useGetEngineDatasChatPlay from '../hooks/useGetEngineDatasChatPlay';
import useFetchRag from '../modal/ModalRetreivalSetting/model/useFetchRag';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { UseFormWatch, UseFormReset, UseFormSetValue } from 'react-hook-form';

import { showNotification } from '@/shared/utils/common-helper';

import {
  chatPlayEngineData,
  chatPlayTabInfoState,
  chatbotDataChatPlay as useChatbotData,
  roomInfoStateChatplay as useRoomInfoState,
  retrievalCreate,
} from '@/shared/store/chatplay';
import {
  gptIsModelSaveLoading,
  gptIsRagModelCreating,
  checkDuplicate as checkDuplicateState,
  checkList as retreivlCheckList,
} from '@/shared/store/rag';
import { userLoginState as useUserLoginStore } from '@/shared/store/onpromise';
import { SOCKET_EVENT } from '@/shared/lib/chatplayOptions';
import { pageIndex } from '@/shared/store/page-data';

interface IFormValues {
  name: string;
  system_prompt: string;
  retriever_id: number | null;
  llm_workflow_id: number | null;
  llm_configs: IEngineParameterChatPlay[];
  retriever_top_k: number | null;
}

interface IEngineParameterChatPlayProps {
  watch: UseFormWatch<IFormValues>;
  reset: UseFormReset<IFormValues>;
  setValue: UseFormSetValue<IFormValues>;

  socket: any;
}

const useChatPlayPipelineFlowViewModel = ({ watch, reset, setValue, socket }: IEngineParameterChatPlayProps) => {
  const { t } = useTranslation(['chatplay']);

  const { llmEngineList } = useGetEngineDatasChatPlay();
  const { getCheckCreating, getRetrieverList, getRagListData } = useFetchRag();
  const { postChatbotData } = useFetchChatplay();

  const enginData = useRecoilValue(chatPlayEngineData);
  const activeTab = useRecoilValue(chatPlayTabInfoState);

  const nameValue = watch('name');
  const systemPromptValue = watch('system_prompt');
  const llmEngineIdValue = watch('llm_workflow_id');
  const selectedLLMEngine = findEngineById(enginData.llm, llmEngineIdValue);
  const retrieverIdValue = watch('retriever_id');

  const selectedRAGEngine = findEngineById(enginData.rag, retrieverIdValue);

  const [roomInfoState, setRoomInfoState] = useRecoilState(useRoomInfoState);
  const chatbotdata = useRecoilValue(useChatbotData);
  const selectedChatbot = chatbotdata.find((chatbot) => chatbot.chatbot_id === roomInfoState.checkId);
  const [radioValue, setRadioValue] = useState<'LLM' | 'RAG'>('RAG');
  const [isRagModalChanged, setIsRagModalChanged] = useRecoilState<boolean>(retrievalCreate);

  const [isRagModelCreatingState] = useState(false);
  const [selectedRetreivalModal, setSelectedRetrievalModal] = useState<MODAL_RETREIVAL_TYPE>({
    isShow: false,
    name: '',
  });

  const setCheckList = useSetRecoilState(retreivlCheckList);
  const [isRagModelCreating, setIsRagModelCreating] = useRecoilState(gptIsRagModelCreating);
  const setIsModelSaveLoading = useSetRecoilState(gptIsModelSaveLoading);
  const setCheckDuplicate = useSetRecoilState<boolean>(checkDuplicateState);

  const resetCurrentPage = useResetRecoilState(pageIndex);

  const [clickStates, setClickStates] = useState({
    promptClick: true,
    sourcefileClick: true,
    llmClick: true,
    ragClick: true,
    exampleClick: true,
  });

  const isSelectedEngine = selectedLLMEngine || selectedRAGEngine;
  const userLoginState = useRecoilValue(useUserLoginStore);

  const handleToggleClick = (key: keyof typeof clickStates) => {
    setClickStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (enginData) {
      setValue('llm_workflow_id', enginData.llm[0]?.llm_workflow_id);
    }
  }, [enginData, selectedLLMEngine]);

  useEffect(() => {
    if (!selectedChatbot) return;

    if (
      !enginData.rag.some((item) => {
        return Number(item.value) === Number(selectedChatbot.retriever_id);
      })
    ) {
      showNotification(t('chatplay:기존_등록된_문서가_삭제_되었습니다_새로운_문서를_선택해주세요'), 'error');
    }
  }, [selectedChatbot]);

  useEffect(() => {
    setRoomInfoState((prev) => ({ ...prev, chatbotType: 'RAG' }));
  }, [selectedChatbot]);

  useEffect(() => {
    if (selectedChatbot) {
      reset({
        name: selectedChatbot.name,
        system_prompt: selectedChatbot.system_prompt,
        retriever_id: selectedChatbot.retriever_id,
        llm_workflow_id: selectedChatbot.llm_workflow_id,

        retriever_top_k: selectedChatbot.retriever_top_k,
        llm_configs: selectedChatbot.llm_configs,
      });
      setRadioValue('RAG');
    } else {
      reset({
        name: '',
        system_prompt: '',
        retriever_id: null,
        llm_workflow_id: null,

        llm_configs: [],
        retriever_top_k: 1,
      });
      setRadioValue('RAG');
    }
  }, [chatbotdata, roomInfoState.checkId, reset]);

  useEffect(() => {
    if (socket) {
      const handleDataEmbedded = async (data: string) => {
        console.log(data);
        showNotification(t('chatplay:모델이_정상적으로_생성되었습니다'), 'success');
        setIsRagModalChanged(false);
        setIsModelSaveLoading(false);
        setCheckDuplicate(false);
        setIsRagModelCreating(false);
        setCheckList([]);
        await getRetrieverList();
        await getRagListData(1);
      };
      const handleError = (data: IResponseError) => {
        showNotification(data.message, 'error');

        return;
      };
      socket.on(SOCKET_EVENT.DATA_EMBEDDED, handleDataEmbedded);
      socket.on(SOCKET_EVENT.ERROR_RETRIEVER_CREATE, handleError);
      return () => {
        socket.off(SOCKET_EVENT.DATA_EMBEDDED);
        socket.off(SOCKET_EVENT.ERROR_RETRIEVER_CREATE);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (isRagModalChanged && radioValue === 'RAG') {
      getRetrieverList();
    } else if (radioValue === 'RAG' && !isRagModalChanged) {
      ``;
      getRetrieverList();
      getCheckCreating();
    }
  }, [radioValue, isRagModalChanged]);

  useEffect(() => {
    if (selectedRAGEngine) {
      setValue('retriever_top_k', selectedRAGEngine.retriever_top_k);
    } else if (selectedLLMEngine && selectedChatbot) {
      setValue('llm_configs', selectedChatbot.llm_configs);
    }
  }, [selectedRAGEngine, selectedLLMEngine, setValue]);

  const saveSettingDetail = async (data: IFormValues) => {
    console.log('final data', data);
    const isCreating = roomInfoState.checkId === 'create_option';

    type ConfigsType = {
      [key: string]: any;
    };

    const extractDefaultValues = (configs: ConfigsType) => {
      console.log('configs', configs);
      return Object.keys(configs).reduce((acc: { [key: string]: string }, key) => {
        acc[key] = configs[key]?.toString() || '';
        return acc;
      }, {});
    };

    const finalData = {
      ...data,
      chatbot_id: isCreating ? null : roomInfoState.checkId,
      name: data.name,
      type: radioValue,
      retriever_id: radioValue === 'RAG' ? retrieverIdValue : null,
      llm_workflow_id: data.llm_workflow_id,
      llm_configs: extractDefaultValues(data.llm_configs),
      retriever_top_k: radioValue === 'RAG' ? data.retriever_top_k : null,
      system_prompt: data.system_prompt,
      questions: [],
    };
    console.log(finalData);

    await postChatbotData(finalData);
  };

  const handleEngineChange = (
    e: React.MouseEvent<HTMLButtonElement>,
    engineType: 'llm_workflow_id' | 'retriever_id',
  ) => {
    e.preventDefault();
    const selectedValue = e.currentTarget.dataset.value;

    setValue(engineType, selectedValue ? Number(selectedValue) : null);
  };

  const getCurrentEngineLabel = (engineId: number | null, engineList: any[], type: 'llm' | 'rag') => {
    if (engineId && type === 'llm') {
      const selectedEngine = engineList.find((engine) => engine.llm_workflow_id === Number(engineId));
      if (selectedEngine) {
        return selectedEngine.name;
      }
      return '엔진을 선택하세요.';
    } else if (engineId && type === 'rag') {
      const selectedEngine = engineList.find((engine) => engine.value === Number(engineId));
      if (selectedEngine) {
        return selectedEngine.label;
      }
      return '등록한 문서를 선택하세요.';
    }
  };

  const currentLLMLabel = useMemo(
    () => getCurrentEngineLabel(llmEngineIdValue, enginData.llm, 'llm'),
    [llmEngineIdValue, enginData.llm],
  );
  const currentRAGLabel = useMemo(
    () => getCurrentEngineLabel(retrieverIdValue, enginData.rag, 'rag'),
    [retrieverIdValue, enginData.rag],
  );

  const onSubmit = async (data: IFormValues) => {
    console.log('onSubmit data', data);

    console.log('맞출 data', data.llm_configs);

    const LLMConfigValid = Object.entries(data.llm_configs).map(([key, value]) => {
      return [key, Number(value)];
    });

    const isValid = LLMConfigValid.every(([key, value]) => {
      const range = selectedLLMEngine.config[key].range;
      // console.log('selectedLLMEngine.config[key].range.from:', range.from);
      // console.log('value:', value);
      // console.log('selectedLLMEngine.config[key].range.to:', range.to);

      return range.from <= value && value <= range.to;
    });

    if (!isValid) {
      showNotification(t('chatplay:LLM_모델_설정_범위를_다시_확인해_주세요'), 'error');
      return;
    }

    saveSettingDetail(data);
  };

  const checkDisabled = () => {
    const isSaveDisabled =
      radioValue === 'LLM'
        ? !selectedLLMEngine || !nameValue || !isSelectedEngine || !systemPromptValue || !userLoginState.accessToken
        : !selectedLLMEngine ||
          !retrieverIdValue ||
          !watch('retriever_top_k') ||
          !nameValue ||
          !isSelectedEngine ||
          !systemPromptValue ||
          !userLoginState.accessToken;
    !nameValue || !isSelectedEngine || !systemPromptValue || !userLoginState.accessToken;

    return isSaveDisabled;
  };

  const handleOpenRagList = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    resetCurrentPage();
    setSelectedRetrievalModal((prev) => ({
      ...prev,
      isShow: true,
      name: '',
    }));
  };

  const closeModal = () => {
    if (!isRagModelCreatingState) {
      setSelectedRetrievalModal((prev) => ({
        ...prev,
        isShow: false,
        name: '',
      }));
    }
  };

  const refineEngineConfig = (config: Config): RefinedConfig => {
    // console.log('refineEngineConfig config', config);

    return Object.entries(config).reduce((result, [key, value]) => {
      result[key as keyof Config] = value.default_value.toString();
      return result;
    }, {} as RefinedConfig);
  };

  return {
    activeTab,
    onSubmit,
    clickStates,
    handleToggleClick,
    isRagModelCreating,
    handleOpenRagList,
    enginData,
    currentRAGLabel,
    handleEngineChange,
    llmEngineList,
    selectedLLMEngine,
    refineEngineConfig,
    checkDisabled,
    selectedRetreivalModal,
    closeModal,
    selectedChatbot,
    currentLLMLabel,
  };
};

export default useChatPlayPipelineFlowViewModel;
