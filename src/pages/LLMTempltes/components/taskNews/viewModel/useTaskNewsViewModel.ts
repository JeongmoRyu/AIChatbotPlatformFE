import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLlmTaskSocketEventHooks } from '@/pages/LLMTempltes/hooks/useLlmTaskSocketEventHooks';

import { LLM_TASK_EXAMPLE, LLM_TASK_EXAMPLE_ENG } from '@/shared/lib/llmTaskUi';
import { showNotification } from '@/shared/utils/common-helper';

const useTaskNewsViewModel = ({ setValue }: LlmViewModelProps) => {
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

  const [createdContents, setCreatedContents] = useState<string>('');

  const [topic, setTopic] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const [paramValue, setParamValue] = useState<LlmNewsProps>();
  const [disableBtn, setDisableBtn] = useState<boolean>(false);

  const SAMPLE = i18n.resolvedLanguage === 'ko' ? LLM_TASK_EXAMPLE : LLM_TASK_EXAMPLE_ENG;

  useEffect(() => {
    if (isConnect && paramValue) {
      if (isConnect && paramValue) {
        if (createdContents) {
          recreateNewsData();
        } else {
          createNewsData(paramValue);
        }
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

    console.log('llmRes', llmRes);

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
    const topic = SAMPLE.news[i].topic;
    const content = SAMPLE.news[i].content;

    setValue('topic', topic);
    setValue('content', content);

    setDisableBtn(false);

    setCreatedContents('');

    setTopic(topic);
    setContent(content);
  };

  const onSubmit = async (data: LlmNewsProps) => {
    try {
      if (!isNewCreating) {
        setCreatedContents('');
        setParamValue(data);

        const params = {
          ...data,
          language: i18n.language === 'ko' ? '한국어' : 'English',
        };

        setParamValue(params);

        if (isConnect) {
          createNewsData(params);
        } else {
          connectSocketServer();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createNewsData = (params: LlmNewsProps) => {
    setDisableBtn(true);
    setIsNewCreating(true);
    sendClientData('maum_news_content_supply', params);
  };

  const handleClickReCreateContents = () => {
    recreateNewsData();
  };

  const recreateNewsData = () => {
    if (paramValue && paramValue.content) {
      if (isConnect) {
        recreateData();
      } else {
        connectSocketServer();
      }
    } else {
      showNotification(t('common:생성된_데이터가_존재하지_않습니다'), 'error');
    }
  };

  const recreateData = () => {
    const params = {
      ...paramValue,
    };

    setIsReCreate(true);
    setDisableBtn(true);
    sendClientData('maum_news_content_supply', params);
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

export default useTaskNewsViewModel;
