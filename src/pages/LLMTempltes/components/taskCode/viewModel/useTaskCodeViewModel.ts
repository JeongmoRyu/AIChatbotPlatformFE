import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useLlmTaskSocketEventHooks } from '@/pages/LLMTempltes/hooks/useLlmTaskSocketEventHooks';

import { CODE_LANGUAGES_CHANGES, LLM_TASK_EXAMPLE, LLM_TASK_EXAMPLE_ENG } from '@/shared/lib/llmTaskUi';
import { showNotification } from '@/shared/utils/common-helper';

const useTaskCodeViewModel = ({ setValue }: LlmViewModelProps) => {
  const { t, i18n } = useTranslation(['llm', 'common']);

  const defaultValue = {
    content: '',
    code_language: CODE_LANGUAGES_CHANGES[0].value,
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
    endEvent,
  } = useLlmTaskSocketEventHooks('LLM');

  const [isNewCreating, setIsNewCreating] = useState<boolean>(false);
  const [isReCreate, setIsReCreate] = useState<boolean>(false);

  const [content, setContent] = useState<string>('');
  const [paramValue, setParamValue] = useState<LlmCodeProps>(defaultValue);

  const [createdContents, setCreatedContents] = useState<string>('');

  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(CODE_LANGUAGES_CHANGES[0].label);

  const SAMPLE = i18n.resolvedLanguage === 'ko' ? LLM_TASK_EXAMPLE : LLM_TASK_EXAMPLE_ENG;
  const clickedExIndexRef = useRef<number>(0);

  const translatedTypeList = CODE_LANGUAGES_CHANGES.map((item) => ({
    ...item,
    label: item.label,
  }));

  useEffect(() => {
    setValue('code_language', selectedLanguage);
  }, [selectedLanguage, setValue]);

  useEffect(() => {
    if (isConnect && paramValue) {
      if (createdContents) {
        recreateCodeData();
      } else {
        createNewCodeData(paramValue);
      }
    }
  }, [isConnect]);

  useEffect(() => {
    if (endEvent) {
      const contentKey = SAMPLE.code[clickedExIndexRef.current].content;
      const content = contentKey;

      setValue('content', content);

      setContent(content);
      setCreatedContents('');

      setIsNewCreating(false);
      setDisableBtn(false);
    }
  }, [endEvent]);

  useEffect(() => {
    if (llmStartRes) {
      console.log('*** START LLM ***');
    }
  }, [llmStartRes]);

  useEffect(() => {
    if (llmRes) {
      setCreatedContents(llmRes);
    }
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
    clearSocketConnection();
    clickedExIndexRef.current = i;

    const language = SAMPLE.code[i].language;
    const content = SAMPLE.code[i].content;
    setValue('code_language', language);
    setSelectedLanguage(language);
    setValue('content', content);

    setDisableBtn(false);
    setCreatedContents('');

    setContent(content);

    setIsNewCreating(false);
  };

  const onSubmit = (data: LlmCodeProps) => {
    console.log(data);
    try {
      if (!isNewCreating) {
        setCreatedContents('');
        setParamValue(data);

        if (isConnect) {
          createNewCodeData(data);
        } else {
          connectSocketServer();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createNewCodeData = (params: LlmCodeProps) => {
    console.log('*** createNewCodeData ***');
    params.language = i18n.resolvedLanguage === 'ko' ? '한국어' : 'English';
    setDisableBtn(true);
    setIsNewCreating(true);
    sendClientData('maum_write_code_supply', params);
  };

  const handleClickReCreate = () => {
    if (paramValue && createdContents) {
      if (isConnect) {
        recreateCodeData();
      } else {
        connectSocketServer();
      }
    } else {
      showNotification(t('common:생성된_데이터가_존재하지_않습니다'), 'error');
    }
  };

  const recreateCodeData = () => {
    const params = {
      ...paramValue,
      language: i18n.resolvedLanguage === 'ko' ? '한국어' : 'English',
    };
    setIsReCreate(true);
    setDisableBtn(true);
    sendClientData('maum_write_code_supply', params);
  };

  return {
    handleClickReCreate,
    onSubmit,
    handleClickEx,
    translatedTypeList,
    selectedLanguage,
    setContent,
    content,
    createdContents,
    isReCreate,
    isNewCreating,
    disableBtn,
  };
};

export default useTaskCodeViewModel;
