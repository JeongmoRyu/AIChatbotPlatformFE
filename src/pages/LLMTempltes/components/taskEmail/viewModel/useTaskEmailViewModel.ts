import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { showNotification } from '@/shared/utils/common-helper';
import { LLM_TASK_EXAMPLE, LLM_TASK_EXAMPLE_ENG, RECREATE_CONFIG } from '@/shared/lib/llmTaskUi';
import { useLlmTaskSocketEventHooks } from '@/pages/LLMTempltes/hooks/useLlmTaskSocketEventHooks';

const useTaskEmailViewModel = ({ setValue }: LlmViewModelProps) => {
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

  const [createdContent, setCreatedContents] = useState<string>('');

  const [purpose, setPurpose] = useState<string>('');

  const [customPurpose, setCustomPurpose] = useState<string>('');
  const [contentInput, setContentInput] = useState<string>('');

  const [paramValue, setParamValue] = useState<LlmEmailSendParamProps>();
  const [disableBtn, setDisableBtn] = useState<boolean>(false);

  const SAMPLE = i18n.resolvedLanguage === 'ko' ? LLM_TASK_EXAMPLE : LLM_TASK_EXAMPLE_ENG;

  const LLM_TASK_INFO_CONTENT = 'maum_email_supply';

  useEffect(() => {
    setPurpose(i18n.language === 'ko' ? '사업 제안' : 'Business Proposal');
  }, [t, i18n]);

  useEffect(() => {
    if (isConnect && paramValue) {
      if (createdContent) {
        recreateSendEmailData();
      } else {
        createNewSendEmailData(paramValue);
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

  const onSubmit = (data: LlmEmailSendParamProps) => {
    try {
      if (!isNewCreating) {
        setCreatedContents('');

        const { style, content, ...rest } = data;

        console.log(rest);

        const paramsKo = {
          ...data,
          purpose: customPurpose ? customPurpose : purpose,
          type: '발신',
          language: '한국어',
        };

        console.log('dataPurpose', data);

        const paramsEn = {
          ...data,
          purpose: customPurpose ? customPurpose : purpose,
          type: 'Sending',
          language: 'English',
        };

        switch (i18n.language) {
          case 'ko':
            if (isConnect) {
              createNewSendEmailData(paramsKo);
            } else {
              setParamValue(paramsKo);
              connectSocketServer();
            }
            break;
          case 'en':
            if (isConnect) {
              createNewSendEmailData(paramsEn);
            } else {
              setParamValue(paramsEn);
              connectSocketServer();
            }
            break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createNewSendEmailData = (params: LlmEmailSendParamProps) => {
    setDisableBtn(true);
    setIsNewCreating(true);

    sendClientData(LLM_TASK_INFO_CONTENT, params);
  };

  const handleOnChangePurpose = (option: optionProps) => () => {
    setPurpose(t(option.value) as string);
    setCustomPurpose('');
  };

  const handleClickReCreateContents = () => {
    recreateSendEmailData();
  };

  const recreateSendEmailData = () => {
    if (paramValue && paramValue.language) {
      if (isConnect) {
        recreateEmailData();
      } else {
        connectSocketServer();
      }
    } else {
      showNotification(t('common:생성된_데이터가_존재하지_않습니다'), 'error');
    }
  };

  const recreateEmailData = () => {
    const params = {
      ...paramValue,
      config: RECREATE_CONFIG,
    };
    setDisableBtn(true);

    setIsReCreate(true);
    sendClientData(LLM_TASK_INFO_CONTENT, params);
  };

  const handleClickEx = (i: number) => {
    const purpose = SAMPLE.email.SEND[i].purpose;
    const content = SAMPLE.email.SEND[i].content;

    setValue('purpose', purpose);
    setValue('content', content);

    setDisableBtn(false);
    setCreatedContents('');

    setContentInput(content);
  };

  return {
    handleClickEx,
    handleClickReCreateContents,
    handleOnChangePurpose,
    onSubmit,
    setPurpose,
    purpose,
    setCustomPurpose,
    customPurpose,
    setContentInput,
    contentInput,
    isNewCreating,
    createdContent,
    isReCreate,
    disableBtn,
  };
};

export default useTaskEmailViewModel;
