import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { showNotification } from '@/shared/utils/common-helper';

import { useLlmTaskSocketEventHooks } from '@/pages/LLMTempltes/hooks/useLlmTaskSocketEventHooks';
import { LLM_TASK_EXAMPLE, LLM_TASK_EXAMPLE_ENG } from '@/shared/lib/llmTaskUi';

const useTaskEditViewModel = ({ setValue }: LlmViewModelProps) => {
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
  const [createdContents, setCreatedContents] = useState<string>('');

  const [paramValue, setParamValue] = useState<LlmEditProps>();
  const [disableBtn, setDisableBtn] = useState<boolean>(false);

  const SAMPLE = i18n.resolvedLanguage === 'ko' ? LLM_TASK_EXAMPLE : LLM_TASK_EXAMPLE_ENG;

  const LLM_TASK_INFO_CONTENT = 'maum_document_editing_summary_supply';

  useEffect(() => {
    if (isConnect && paramValue) {
      if (createdContents) {
        recreateRevisionDocData();
      } else {
        createNewRevisionDocData(paramValue);
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
    const content = SAMPLE.revision[i].content;

    setValue('content', content);
    setContent(content);

    setDisableBtn(false);
    setCreatedContents('');

    clearSocketConnection();
    setIsNewCreating(false);
  };

  const onSubmit = (data: LlmEditProps) => {
    console.log(data);
    try {
      if (!isNewCreating) {
        setCreatedContents('');
        setParamValue(data);

        if (isConnect) {
          createNewRevisionDocData(data);
        } else {
          connectSocketServer();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createNewRevisionDocData = (params: LlmEditProps) => {
    console.log('*** createNewRevisionDocData ***');
    params.language = i18n.resolvedLanguage === 'ko' ? '한국어' : 'English';
    setDisableBtn(true);
    setIsNewCreating(true);
    sendClientData(LLM_TASK_INFO_CONTENT, params);
  };

  const handleClickReCreate = () => {
    console.log('*** Recreate ***');
    if (paramValue && paramValue.content && createdContents) {
      if (isConnect) {
        recreateRevisionDocData();
      } else {
        connectSocketServer();
      }
    } else {
      showNotification(t('common:생성된_데이터가_존재하지_않습니다'), 'error');
    }
  };

  const recreateRevisionDocData = () => {
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
    onSubmit,
    handleClickEx,
    setContent,
    content,
    isNewCreating,
    createdContents,
    isReCreate,
    disableBtn,
  };
};

export default useTaskEditViewModel;
