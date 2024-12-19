import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useRestfulCustomAxios } from './useRestfulCustomAxios';
import { showNotification } from '@/shared/utils/common-helper';
import { chatbotIdState as useChatbotIdState } from '@/shared/store/onpromise';

interface AllEngineListType {
  elasticList: SelectListType[];
  llmEngineList: SelectListType[];
  ragEngineList: SelectListType[];
}

export default function useGetEngineDatas() {
  const { sendRequest } = useRestfulCustomAxios();
  const chatbotId = useRecoilValue(useChatbotIdState);
  const [allEngineList, setAllEngineList] = useState<AllEngineListType>({
    elasticList: [],
    llmEngineList: [],
    ragEngineList: [],
  });
  const [allEngineData, setAllEngineData] = useState<ILLMEngineData[]>([]);

  useEffect(() => {
    getAllEngines();
  }, []);
  interface EngineItemType {
    id: number;
    name: string;
    parameters: IEngineParameter;
  }

  const getAllEngines = async () => {
    const params = { chatbot_id: chatbotId };
    const response = await sendRequest('/chatbotinfo/optionlist', 'get', undefined, undefined, params);
    if (response && response.data) {
      const data = response.data.data;
      if (data) {
        const { elasticList, llmEngineList, ragEngineList } = data;
        const extractIdAndName = (list: EngineItemType[]) =>
          list.map(({ id, name, parameters }) => ({ id: name, value: id, text: name, parameters: parameters }));
        setAllEngineList({
          elasticList: extractIdAndName(elasticList),
          llmEngineList: extractIdAndName(llmEngineList),
          ragEngineList: extractIdAndName(ragEngineList),
        });

        setAllEngineData(data);
      }
    } else {
      showNotification('서버로부터 정상적인 엔진 정보를 받지 못했습니다.', 'error');
      return;
    }
  };

  return { allEngineList, allEngineData };
}
