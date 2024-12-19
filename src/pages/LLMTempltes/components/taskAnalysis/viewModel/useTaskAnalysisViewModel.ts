import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LLM_TASK_EXAMPLE, LLM_TASK_EXAMPLE_ENG } from '@/shared/lib/llmTaskUi';
import { showNotification } from '@/shared/utils/common-helper';
import { useLlmTaskSocketEventHooks } from '@/pages/LLMTempltes/hooks/useLlmTaskSocketEventHooks';

const useTaskAnalysisViewModel = ({ setValue }: LlmViewModelProps) => {
  const { t, i18n } = useTranslation(['llm', 'common']);

  const {
    isConnect,
    llmStartRes,
    llmRes,
    llmEndRes,
    connectSocketServer,
    clearSocketConnection,
    clearResponseData,
    sendClientData,
  } = useLlmTaskSocketEventHooks('LLM');

  const [isNewCreating, setIsNewCreating] = useState<boolean>(false);
  const [isReCreate, setIsReCreate] = useState<boolean>(false);

  const [content, setContent] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [paramValue, setParamValue] = useState<LlmAnalysisProps>();

  const [createdContents, setCreatedContents] = useState<string>('');

  const [disableBtn, setDisableBtn] = useState<boolean>(false);

  const SAMPLE = i18n.resolvedLanguage === 'ko' ? LLM_TASK_EXAMPLE : LLM_TASK_EXAMPLE_ENG;
  const LLM_TASK_INFO_CONTENT = 'maum_document_analysis_summary_supply';

  useEffect(() => {
    if (isConnect && paramValue) {
      if (createdContents) {
        recreateAnalysisDocData();
      } else {
        createNewAnalysisDocData(paramValue);
      }
    }
  }, [isConnect]);

  useEffect(() => {
    if (llmStartRes) {
      console.log('*** START LLM ***');
    }
  }, [llmStartRes]);

  useEffect(() => {
    if (!llmRes) return;
    setCreatedContents(llmRes);
  }, [llmRes]);

  useEffect(() => {
    if (llmEndRes) {
      console.log('*** END LLM ***');
      clearResponseData();
      setIsNewCreating(false);
      setIsReCreate(false);
      setDisableBtn(false);
      clearSocketConnection();
    }
  }, [llmEndRes]);

  const handleClickEx = (i: number) => {
    const content = SAMPLE.analysis[i].content;
    const details = SAMPLE.analysis[i].details;

    setValue('content', content);
    setValue('details', details);

    setDisableBtn(false);
    setCreatedContents('');

    setContent(content);
    setDetails(details);
  };

  const onSubmit = (data: LlmAnalysisProps) => {
    try {
      if (!isNewCreating) {
        setCreatedContents('');
        setParamValue(data);

        if (isConnect) {
          createNewAnalysisDocData(data);
        } else {
          connectSocketServer();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createNewAnalysisDocData = (params: LlmAnalysisProps) => {
    setDisableBtn(true);
    params.language = i18n.resolvedLanguage === 'ko' ? '한국어' : 'English';
    setIsNewCreating(true);
    sendClientData(LLM_TASK_INFO_CONTENT, params);
  };

  const handleClickReCreate = () => {
    if (paramValue && paramValue.content) {
      if (isConnect) {
        recreateAnalysisDocData();
      } else {
        connectSocketServer();
      }
    } else {
      showNotification(t('common:생성된_데이터가_존재하지_않습니다'), 'error');
    }
  };

  const recreateAnalysisDocData = () => {
    const params = {
      ...paramValue,
      language: i18n.resolvedLanguage === 'ko' ? '한국어' : 'English',
    };
    setIsReCreate(true);
    setDisableBtn(true);
    sendClientData(LLM_TASK_INFO_CONTENT, params);
  };
  return {
    handleClickReCreate,
    handleClickEx,
    isNewCreating,
    createdContents,
    isReCreate,
    disableBtn,
    details,
    setDetails,
    content,
    setContent,
    onSubmit,
  };
};

export default useTaskAnalysisViewModel;
