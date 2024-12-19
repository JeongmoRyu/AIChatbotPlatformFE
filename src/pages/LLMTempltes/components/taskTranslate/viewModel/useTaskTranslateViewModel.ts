import { useEffect, useState } from 'react';

import { useLlmTaskSocketEventHooks } from '@/pages/LLMTempltes/hooks/useLlmTaskSocketEventHooks';
import { LLM_TASK_EXAMPLE, LLM_TASK_EXAMPLE_ENG, TRANSLATE_LANGUAGE_CHANGES } from '@/shared/lib/llmTaskUi';
import { showNotification } from '@/shared/utils/common-helper';
import { useTranslation } from 'react-i18next';

const useTaskTranslateViewModel = ({ setValue }: LlmViewModelProps) => {
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
  const [paramValue, setParamValue] = useState<LlmTranslateProps>();

  const [createdContents, setCreatedContents] = useState<string>('');
  const [disableBtn, setDisableBtn] = useState<boolean>(false);

  const SAMPLE = i18n.resolvedLanguage === 'ko' ? LLM_TASK_EXAMPLE : LLM_TASK_EXAMPLE_ENG;
  const LLM_TASK_INFO_CONTENT = 'maum_translation_summary_supply';

  const translatedTypeList = TRANSLATE_LANGUAGE_CHANGES.map((item) => ({
    ...item,
    label: item.label,
  }));

  const [, setDefaultParams] = useState({
    content: '',
    language: translatedTypeList[0].label,
  });

  useEffect(() => {
    setDefaultParams({
      content: '',
      language: translatedTypeList[0].label,
    });
  }, []);

  useEffect(() => {
    if (isConnect && paramValue) {
      if (createdContents) {
        recreateTranslateData();
      } else {
        createNewTranslateData(paramValue);
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
      setDisableBtn(false);
      setIsNewCreating(false);
      setIsReCreate(false);
      clearSocketConnection();
    }
  }, [llmEndRes]);

  const handleClickEx = (i: number) => {
    const content = SAMPLE.translate[i].content;

    setValue('content', content);
    setContent(content);

    setDisableBtn(false);
    setCreatedContents('');
  };

  const onSubmit = async (data: LlmTranslateProps) => {
    try {
      if (!isNewCreating) {
        setCreatedContents('');
        setParamValue(data);

        if (i18n.language === 'en') {
          data.language = 'English';
        }
        if (i18n.language === 'ko') {
          data.language = '한국어';
        }

        if (isConnect) {
          createNewTranslateData(data);
        } else {
          connectSocketServer();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createNewTranslateData = (params: LlmTranslateProps) => {
    console.log('*** createNewTranslateData ***');
    setDisableBtn(true);
    setIsNewCreating(true);
    sendClientData(LLM_TASK_INFO_CONTENT, params);
  };

  const handleClickReCreate = () => {
    if (paramValue && paramValue.content && createdContents) {
      if (isConnect) {
        recreateTranslateData();
      } else {
        connectSocketServer();
      }
    } else {
      showNotification(t('common:생성된_데이터가_존재하지_않습니다'), 'error');
    }
  };

  const recreateTranslateData = () => {
    const params = {
      ...paramValue,
    };
    setIsReCreate(true);
    setDisableBtn(true);
    sendClientData(LLM_TASK_INFO_CONTENT, params);
  };

  return {
    handleClickReCreate,
    handleClickEx,
    onSubmit,
    disableBtn,
    setContent,
    content,
    isNewCreating,
    createdContents,
    isReCreate,
  };
};

export default useTaskTranslateViewModel;
