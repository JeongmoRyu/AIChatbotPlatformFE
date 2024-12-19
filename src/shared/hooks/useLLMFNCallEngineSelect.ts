import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { LLMFnCallEngineApiList as useLLMFnCallEngineApiList } from '@/shared/store/onpromise';
import { useRestfulCustomAxios } from './useRestfulCustomAxios';
import { showNotification } from '@/shared/utils/common-helper';

const useLLMFNCallEngineSelect = () => {
  const { sendRequest } = useRestfulCustomAxios();
  const [llmFnCallEngineApi, setLlmFnCallEngineApi] = useRecoilState(useLLMFnCallEngineApiList);

  const getLLMFnCallEngines = useCallback(async () => {
    if (!llmFnCallEngineApi) {
      const response = await sendRequest('/engine/FNCALL', 'get');
      if (response && response.data) {
        const data = response.data.data;
        if (data && data.length > 0) {
          const responseData = data;
          const typeList: SelectListType[] = responseData.map((item: Engine_Types) => ({
            text: item.name,
            id: item.name,
            value: item.id,
          }));
          return setLlmFnCallEngineApi(typeList);
        }
      } else {
        showNotification('서버로부터 정상적인 엔진 정보를 받지 못했습니다.', 'error');
        return undefined;
      }
    }
  }, []);

  useEffect(() => {
    getLLMFnCallEngines();
  }, []);

  return llmFnCallEngineApi;
};

export default useLLMFNCallEngineSelect;
