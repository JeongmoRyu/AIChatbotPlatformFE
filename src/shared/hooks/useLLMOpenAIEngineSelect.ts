import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { LLMOpenAIEngineSelectList as useLLMOpenAIEngineApi } from '@/shared/store/onpromise';
import { useRestfulCustomAxios } from './useRestfulCustomAxios';
import { showNotification } from '@/shared/utils/common-helper';

const useLLMOpenAIEngineSelect = () => {
  const { sendRequest } = useRestfulCustomAxios();
  const [llmoOpenAIEngineApi, setLlmOpenAIEngineApi] = useRecoilState(useLLMOpenAIEngineApi);

  const getLLMOpenAIEngines = useCallback(async () => {
    if (!llmoOpenAIEngineApi) {
      const response = await sendRequest('/engine/LLM/OPENAI', 'get');
      if (response && response.data) {
        const data = response.data.data;
        if (data && data.length > 0) {
          const responseData = data;
          const typeList: SelectListType[] = responseData.map((item: Engine_Types) => ({
            text: item.name,
            id: item.name,
            value: item.id,
          }));
          return setLlmOpenAIEngineApi(typeList);
        }
      } else {
        showNotification('서버로부터 정상적인 엔진 정보를 받지 못했습니다.', 'error');
        return undefined;
      }
    }
  }, []);

  useEffect(() => {
    getLLMOpenAIEngines();
  }, []);

  return llmoOpenAIEngineApi;
};

export default useLLMOpenAIEngineSelect;
