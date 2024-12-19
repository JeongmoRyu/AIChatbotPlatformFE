import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useLlmTaskSocketEventHooks } from '@/pages/LLMTempltes/hooks/useLlmTaskSocketEventHooks';
import { LLM_TASK_EXAMPLE, LLM_TASK_EXAMPLE_ENG } from '@/shared/lib/llmTaskUi';
import { showNotification } from '@/shared/utils/common-helper';

type FieldName = 'productName' | 'productInfo' | 'detailedService' | 'companyName' | 'keyword' | 'target';

const useTaskPromotionViewModel = ({ setValue }: LlmViewModelProps) => {
  const { t, i18n } = useTranslation(['lln', 'common']);

  const defaultParams = {
    productName: '',
    productInfo: '',
    detailedService: '',
    companyName: '',
    keyword: '',
    target: '',
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

  const [productDetails, setProductDetails] = useState<LlmPromotionProps>(defaultParams);
  const [contentInput, setContentInput] = useState<string>('');

  const [paramValue, setParamValue] = useState<LlmPromotionProps>();
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const [createdPromotion, setCreatedPromotion] = useState<string>('');

  const SAMPLE = i18n.resolvedLanguage === 'ko' ? LLM_TASK_EXAMPLE : LLM_TASK_EXAMPLE_ENG;

  const inputFields = [
    {
      name: 'productName',
      bigNameKey: '제품_명',
      placeholderKey: '홍보문구생성_제품명_예시',
      helperTextKey: '제품을_입력해주세요',
      setContent: (value: any) => handleFieldChange('productName', value),
      content: productDetails.productName,
      type: 'input',
      point: true,
      limitNum: 500,
    },
    {
      name: 'productInfo',
      bigNameKey: '제품_정보',
      placeholderKey: '홍보문구생성_제품정보_예시',
      helperTextKey: '제품정보를_입력하세요',
      setContent: (value: any) => handleFieldChange('productInfo', value),
      content: productDetails.productInfo,
      type: 'input',
      point: true,
      limitNum: 2000,
    },
    {
      name: 'detailedService',
      bigNameKey: '상세_서비스',
      placeholderKey: '홍보문구생성_상세서비스_예시',
      helperTextKey: '상세서비스를_입력하세요',
      setContent: (value: any) => handleFieldChange('detailedService', value),
      content: productDetails.detailedService,
      type: 'input',
      point: true,
      limitNum: 2000,
    },
    {
      name: 'companyName',
      bigNameKey: '회사명',
      placeholderKey: '홍보문구생성_회사명_예시',
      helperTextKey: '회사명을_입력해주세요',
      setContent: (value: any) => handleFieldChange('companyName', value),
      content: productDetails.companyName,
      type: 'input',
      point: true,
      limitNum: 500,
    },
    {
      name: 'keyword',
      bigNameKey: '홍보_키워드',
      placeholderKey: '홍보문구생성_홍보키워드_예시',
      helperTextKey: '홍보_키워드를_입력해주세요',
      setContent: (value: any) => handleFieldChange('keyword', value),
      content: productDetails.keyword,
      type: 'input',
      point: true,
      limitNum: 1000,
    },
    {
      name: 'target',
      bigNameKey: '타겟_대상',
      placeholderKey: '홍보문구생성_대상타겟_예시',
      helperTextKey: '대상_타겟을_입력해주세요',
      setContent: (value: any) => handleFieldChange('target', value),
      content: productDetails.target,
      type: 'input',
      point: true,
      limitNum: 1000,
    },
  ];

  useEffect(() => {
    if (isConnect && paramValue) {
      if (createdPromotion) {
        recreatePromotionData();
      } else {
        createNewPromotionData(paramValue);
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
    setCreatedPromotion(llmRes);
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
    const fields: FieldName[] = ['productName', 'productInfo', 'detailedService', 'companyName', 'keyword', 'target'];

    setDisableBtn(false);
    setCreatedPromotion('');

    const newFieldValues = fields.reduce((acc, field) => {
      const value = SAMPLE.promotion[i][field];
      setContentInput(value);

      setValue(field, value);
      return acc;
    }, {});

    setProductDetails((prevFields) => ({ ...prevFields, ...newFieldValues }));
    setIsNewCreating(false);
  };

  const onSubmit = async (data: LlmPromotionProps) => {
    try {
      if (!isNewCreating) {
        setCreatedPromotion('');
        setParamValue(data);

        if (isConnect) {
          createNewPromotionData(data);
        } else {
          connectSocketServer();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createNewPromotionData = (params: LlmPromotionProps) => {
    console.log('*** createNewPromotionData ***');
    params.language = i18n.resolvedLanguage === 'ko' ? '한국어' : 'English';
    console.log(params);
    setDisableBtn(true);
    setIsNewCreating(true);
    sendClientData('maum_promotion_supply', params);
  };

  const handleClickReCreate = () => {
    if (paramValue && createdPromotion) {
      if (isConnect) {
        recreatePromotionData();
      } else {
        connectSocketServer();
      }
    } else {
      showNotification(t('common:생성된_데이터가_존재하지_않습니다'), 'error');
    }
  };

  const recreatePromotionData = () => {
    const params = {
      ...paramValue,
      language: i18n.resolvedLanguage === 'ko' ? '한국어' : 'English',
    };
    setIsReCreate(true);
    setDisableBtn(true);
    sendClientData('maum_promotion_supply', params);
  };

  const handleFieldChange = (fieldName: FieldName, value: string) => {
    setProductDetails((prevFields) => ({
      ...prevFields,
      [fieldName]: value,
    }));
  };

  return {
    handleClickReCreate,
    onSubmit,
    handleClickEx,
    inputFields,
    contentInput,
    isNewCreating,
    createdPromotion,
    isReCreate,
    disableBtn,
  };
};

export default useTaskPromotionViewModel;
