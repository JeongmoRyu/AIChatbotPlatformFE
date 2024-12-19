import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLlmTaskSocketEventHooks } from '@/pages/LLMTempltes/hooks/useLlmTaskSocketEventHooks';

import { LLM_TASK_EXAMPLE, LLM_TASK_EXAMPLE_ENG } from '@/shared/lib/llmTaskUi';
import { showNotification } from '@/shared/utils/common-helper';

const useTaskSummaryViewModel = ({ setValue }: LlmViewModelProps) => {
  const { t, i18n } = useTranslation(['llm', 'common']);

  const defaultParams = {
    content: '',
    limitNumber: '',
    limit: true,
    modelNumber: 3,
    language: i18n.resolvedLanguage === 'ko' ? '한국어' : 'English',
  };

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
  const [, setLimitNumber] = useState<number>(0);

  const [createdContents, setCreatedContents] = useState<string>('');

  const [paramValue, setParamValue] = useState<LlmCoreSummaryProps>(defaultParams);
  const [disableBtn, setDisableBtn] = useState<boolean>(false);

  const SAMPLE = i18n.resolvedLanguage === 'ko' ? LLM_TASK_EXAMPLE : LLM_TASK_EXAMPLE_ENG;

  useEffect(() => {
    if (isConnect && paramValue) {
      if (createdContents) {
        recreateCoreSummaryData();
      } else {
        createNewCoreSummaryData(paramValue);
      }
    }
  }, [isConnect]);

  useEffect(() => {
    if (!llmStartRes) return;
    console.log('*** START LLM ***');
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
    const content = SAMPLE.core_summary[i].content;
    const limitNumber = SAMPLE.core_summary[i].limitNumber;

    setValue('content', content);
    setValue('limitNumber', limitNumber);

    setDisableBtn(false);
    setCreatedContents('');

    setContent(content);
    setLimitNumber(parseInt(limitNumber));
  };

  const onSubmit = async (data: LlmCoreSummaryProps) => {
    console.log(data);
    setValue('limitNumber', 10);
    try {
      if (!isNewCreating) {
        setCreatedContents('');
        setParamValue(data);

        if (isConnect) {
          createNewCoreSummaryData(data);
        } else {
          connectSocketServer();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createNewCoreSummaryData = (params: LlmCoreSummaryProps) => {
    params.language = i18n.resolvedLanguage === 'ko' ? '한국어' : 'English';
    setDisableBtn(true);
    setIsNewCreating(true);
    sendClientData('maum_business_document_summary_content_supply', params);
  };

  const handleClickReCreateContents = () => {
    if (paramValue && paramValue.content) {
      if (isConnect) {
        recreateCoreSummaryData();
      } else {
        connectSocketServer();
      }
    } else {
      showNotification(t('common:생성된_데이터가_존재하지_않습니다'), 'error');
    }
  };

  const recreateCoreSummaryData = () => {
    const params = {
      ...paramValue,
      language: i18n.resolvedLanguage === 'ko' ? '한국어' : 'English',
    };

    setIsReCreate(true);
    setDisableBtn(true);
    sendClientData('maum_business_document_summary_content_supply', params);
  };

  return {
    handleClickReCreateContents,
    handleClickEx,
    onSubmit,
    setContent,
    content,
    isNewCreating,
    createdContents,
    isReCreate,
    disableBtn,
  };
};

export default useTaskSummaryViewModel;
