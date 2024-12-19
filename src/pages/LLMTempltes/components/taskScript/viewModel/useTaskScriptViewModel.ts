import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useLlmTaskSocketEventHooks } from '@/pages/LLMTempltes/hooks/useLlmTaskSocketEventHooks';
import { LLM_TASK_EXAMPLE, LLM_TASK_EXAMPLE_ENG } from '@/shared/lib/llmTaskUi';
import { showNotification } from '@/shared/utils/common-helper';

const useTaskScriptViewModel = ({ setValue }: LlmViewModelProps) => {
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

  const [topic, setTopic] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const [createdContents, setCreatedContents] = useState<string>('');

  const [paramValue, setParamValue] = useState<LlmScriptContentProps>();
  const [disableBtn, setDisableBtn] = useState<boolean>(false);

  const SAMPLE = i18n.resolvedLanguage === 'ko' ? LLM_TASK_EXAMPLE : LLM_TASK_EXAMPLE_ENG;

  const LLM_TASK_INFO_TITLE = 'maum_business_video_script_content_supply';

  useEffect(() => {
    if (isConnect && paramValue) {
      if (createdContents) {
        recreateWritingScript();
      } else {
        createNewScriptData(paramValue);
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
    const topic = SAMPLE.script[i].topic;
    const content = SAMPLE.script[i].content;

    setValue('topic', topic);
    setValue('content', content);

    setDisableBtn(false);

    setCreatedContents('');

    setTopic(topic);
    setContent(content);
  };

  const onSubmit = async (data: LlmScriptContentProps) => {
    try {
      if (!isNewCreating) {
        setCreatedContents('');
        setParamValue(data);

        const params = {
          ...data,
        };

        setParamValue(params);

        if (isConnect) {
          createNewScriptData(params);
        } else {
          connectSocketServer();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createNewScriptData = (params: LlmScriptContentProps) => {
    setDisableBtn(true);
    params.language = i18n.resolvedLanguage === 'ko' ? '한국어' : 'English';
    setIsNewCreating(true);
    sendClientData(LLM_TASK_INFO_TITLE, params);
  };

  const handleClickReCreateContents = () => {
    recreateWritingScript();
  };

  const recreateWritingScript = () => {
    if (paramValue) {
      if (isConnect) {
        recreateScriptData();
      } else {
        connectSocketServer();
      }
    } else {
      showNotification(t('common:생성된_데이터가_존재하지_않습니다'), 'error');
    }
  };

  const recreateScriptData = () => {
    const params = {
      ...paramValue,
      language: i18n.resolvedLanguage === 'ko' ? '한국어' : 'English',
    };

    setIsReCreate(true);
    setDisableBtn(true);
    sendClientData(LLM_TASK_INFO_TITLE, params);
  };

  return {
    handleClickReCreateContents,
    onSubmit,
    handleClickEx,
    setTopic,
    topic,
    setContent,
    content,
    isNewCreating,
    createdContents,
    isReCreate,
    disableBtn,
  };
};

export default useTaskScriptViewModel;
