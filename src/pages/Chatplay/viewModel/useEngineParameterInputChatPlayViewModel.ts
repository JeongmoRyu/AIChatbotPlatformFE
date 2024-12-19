import React, { useEffect } from 'react';
import { showNotification } from '@/shared/utils/common-helper';

const useEngineParameterInputChatPlayViewModel = ({
  engineParams,
  paramType,
  setValue,

  watch,
  // getValue,
}: EngineParameterInputPropsViewModel) => {
  const llmEngineIdValue = watch('llm_workflow_id');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: (field: string, value: any) => void,

    engineInfo: any,
    key: string,
  ) => {
    const newValue = e.target.value;

    let numericValue = parseFloat(newValue);

    const decimalPlaces = 2;

    const regex = new RegExp(`^\\d*(\\.\\d{0,${decimalPlaces}})?$`);

    if (
      newValue === '' ||
      (!isNaN(numericValue) &&
        numericValue >= Number(engineInfo[key].range?.from) &&
        numericValue <= Number(engineInfo[key].range?.to) &&
        regex.test(newValue))
    ) {
      const fieldName = `llm_configs[${key}]`;

      setValue(fieldName, Number(newValue.trim()));
    } else {
      showNotification(
        `${engineInfo[key].range?.from} ~ ${engineInfo[key].range?.to} 사이의 숫자를 입력하세요. 소수점 ${decimalPlaces}자리까지 허용됩니다.`,
        'error',
      );
      return;
    }
  };

  useEffect(() => {
    if (engineParams) {
      setValue('llm_configs', 0);
      Object.keys(engineParams).forEach((param) => {
        const fieldName = `llm_configs[${param}]`;

        const value = engineParams[param];

        setValue(fieldName, value !== undefined && value !== null ? Number(value) : 0);
      });
    }
  }, [paramType, setValue]);

  if (!engineParams) return null;
  return { llmEngineIdValue, handleInputChange };
};

export default useEngineParameterInputChatPlayViewModel;
