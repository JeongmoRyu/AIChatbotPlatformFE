// import { Dispatch, SetStateAction, useEffect } from 'react';
// import { useRecoilState, useSetRecoilState } from 'recoil';

// import { useChatPlayAxiosHooks } from './useChatPlayAxiosHooks';
// import { showNotification } from '@/shared/utils/common-helper';

// import { chatPlayEngineData, llmEngineListA } from '@/shared/store/chatplay';
// import { findEngineById } from '@/shared/utils/chat-play-helper';
// // import { userLoginState } from '@/shared/store/onpromise';

// function useGetEngineDatasChatPlay(watch: any) {
//   const { sendRequest } = useChatPlayAxiosHooks();

//   // const [isDataReady, setIsDataReady] = useState(false);

//   // const userLoginInfo = useRecoilValue(userLoginState);
//   const [enginData, setEnginData] = useRecoilState(chatPlayEngineData);

//   const setEngineData = useSetRecoilState(chatPlayEngineData);
//   const [llmEngineList, setLLMEngineList] = useRecoilState(llmEngineListA);

//   const llmEngineIdValue = watch('llm_workflow_id');
//   const selectedLLMEngine = findEngineById(enginData.llm, llmEngineIdValue); //(어떤 llm엔진이 있는가, 어떤 id를 선택했는가)//이거 두개가 안들어 가는게 문제임
//   const retrieverIdValue = watch('retriever_id');
//   const selectedRAGEngine = findEngineById(enginData.rag, retrieverIdValue);
//   // const [llmEngineList, setLLMEngineList] = useState<{ label: string; value: number }[]>([]);

//   // useEffect(() => {
//   //   if (!userLoginInfo.accessToken) {
//   //     return;
//   //   } else {
//   //     getLLMEngines();
//   //   }
//   // }, [userLoginInfo.accessToken]);

//   // useEffect(() => {
//   //   // console.log('데이터 llmEngineList', llmEngineList);
//   // }, [llmEngineList]);

//   useEffect(() => {
//     console.log('selectedLLMEngine에 필요한 요소들');
//     console.log('selectedLLMEngine', selectedLLMEngine);
//     console.log('enginData', enginData);
//     console.log('llmEngineIdValue', llmEngineIdValue);
//   }, [enginData, llmEngineIdValue, selectedLLMEngine]);

//   const getLLMEngines = async () => {
//     const response = await sendRequest(`/workflow/`, 'GET');
//     console.log('getLLMEngines response', response);
//     if (response && response.data.code === 'F000') {
//       const data = response.data.data;

//       if (data && data.length > 0) {
//         // console.log('getLLMEngines data', data);
//         const responseData = data;
//         const typeList = responseData.map((item: any) => ({
//           label: item.name,
//           value: item.llm_workflow_id,
//         }));
//         console.log('typeList', typeList);
//         setLLMEngineList([...typeList]);
//         setEngineData((prev: any) => ({
//           ...prev,
//           llm: data,
//         }));

//         // setIsDataReady(true);
//         // console.log('getLLMEngines llmEngineList', llmEngineList);
//       }
//     } else {
//       showNotification(response?.data.message || '데이터 로드 중 오류가 발생했습니다.', 'error');
//       return;
//     }
//   };

//   // useEffect(() => {
//   //   console.log('getLLMEngines llmEngineList', llmEngineList);
//   // }, [llmEngineList]);

//   return {
//     getLLMEngines,
//     selectedLLMEngine,
//     selectedRAGEngine,
//     // llmEngineList,
//     // isDataReady,
//   };
// }

// export default useGetEngineDatasChatPlay;

import { useEffect, useState } from 'react';
import { useChatPlayAxiosHooks } from '../hooks/useChatPlayAxiosHooks';
import { showNotification } from '@/shared/utils/common-helper';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { chatPlayEngineData } from '@/shared/store/chatplay';
import { userLoginState as useUserLoginStore } from '@/shared/store/onpromise';

function useGetEngineDatas() {
  const { sendRequest } = useChatPlayAxiosHooks();
  const userLoginInfo = useRecoilValue(useUserLoginStore);
  const setEngineData = useSetRecoilState(chatPlayEngineData);
  const [llmEngineList, setLLMEngineList] = useState([]);

  useEffect(() => {
    if (!userLoginInfo.accessToken) {
      return;
    } else {
      getLLMEngines();
    }
  }, [userLoginInfo.accessToken]);

  const getLLMEngines = async () => {
    const response = await sendRequest(`/workflow/`, 'GET');
    if (response && response.data.code === 'F000') {
      const data = response.data.data;

      if (data && data.length > 0) {
        const responseData = data;
        const typeList = responseData.map((item: any) => ({
          label: item.name,
          value: item.llm_workflow_id,
        }));
        setLLMEngineList(typeList);
        setEngineData((prev: any) => ({
          ...prev,
          llm: data,
        }));
      }
    } else {
      showNotification(response?.data.message || '데이터 로드 중 오류가 발생했습니다.', 'error');
      return;
    }
  };

  return {
    llmEngineList,
  };
}

export default useGetEngineDatas;
