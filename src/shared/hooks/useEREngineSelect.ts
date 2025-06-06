import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { EREngineSelectList as useEREngineSelectList } from '@/shared/store/onpromise';
import { useRestfulCustomAxios } from './useRestfulCustomAxios';
import { showNotification } from '@/shared/utils/common-helper';

const useEREngineSelect = () => {
  const { sendRequest } = useRestfulCustomAxios();
  const [EREngineSelectList, setEREngineSelectList] = useRecoilState(useEREngineSelectList);

  const getEREngines = useCallback(async () => {
    if (!EREngineSelectList) {
      const response = await sendRequest('/engine/RANKER', 'get');
      if (response && response.data) {
        const data = response.data.data;
        if (data && data.length > 0) {
          const responseData = data;
          const typeList: SelectListType[] = responseData.map((item: Engine_Types) => ({
            text: item.name,
            id: item.name,
            value: item.id,
          }));
          return setEREngineSelectList(typeList);
        }
      } else {
        showNotification('서버로부터 정상적인 엔진 정보를 받지 못했습니다.', 'error');
        return undefined;
      }
    }
  }, []);

  useEffect(() => {
    getEREngines();
  }, []);

  return EREngineSelectList;
};

export default useEREngineSelect;
