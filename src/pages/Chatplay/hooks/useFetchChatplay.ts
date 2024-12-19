import { useRecoilState, useSetRecoilState } from 'recoil';

import { showNotification } from '@/shared/utils/common-helper';
import { useChatPlayAxiosHooks } from '@/pages/Chatplay/hooks/useChatPlayAxiosHooks';

import {
  roomInfoStateChatplay as useRoomInfoState,
  chatbotDataChatPlay as useChatbotData,
} from '@/shared/store/chatplay';

const useFetchChatplay = () => {
  const { sendRequest } = useChatPlayAxiosHooks();

  const [roomInfoState, setRoomInfoState] = useRecoilState(useRoomInfoState);

  const setChatbotData = useSetRecoilState(useChatbotData);

  const postChatbotData = async (data: any) => {
    const isCreating = roomInfoState.checkId === 'create_option';

    try {
      const response = await sendRequest('/chatbot', 'POST', undefined, data);

      if (response && response.data.result) {
        if (response.data.code !== 'F002') {
          // const data = response.data.data;

          showNotification(isCreating ? '정상적으로 등록되었습니다.' : '정상적으로 수정되었습니다.', 'success');
          await getChatbotData();
        } else {
          showNotification('서버로 정상적인 데이터를 전달하지 못했습니다.', 'error');
        }
      } else {
        showNotification('서버로 정상적인 데이터를 전달하지 못했습니다.', 'error');
      }
    } catch (error) {
      console.error(error);
      showNotification('오류가 발생했습니다.', 'error');
    }
  };

  const getChatbotData = async () => {
    //챗봇 목록 모델 가져오기
    try {
      const response = await sendRequest('/chatbot', 'GET');
      if (response && response.data.code === 'F000') {
        const data = response.data.data;
        if (data && data.length > 0) {
          setChatbotData(data);

          // setRoomInfoState({
          //   ...roomInfoState,
          //   checkId: data[data.length - 1].id,
          // });
        } else {
          showNotification('현재 사용 가능한 데이터가 없습니다.', 'info');
          setRoomInfoState({
            ...roomInfoState,
            checkId: 'create_option',
          });
        }
      } else {
        showNotification(response.data.message || '데이터 로드 중 오류가 발생했습니다.', 'error');
      }
    } catch (error) {
      showNotification('데이터 로드 중 오류가 발생했습니다.', 'error');
      console.error('getChatbotData error', error);
    }
  };

  const deleteChatbot = async (deleteChatbotId: number) => {
    try {
      const response = await sendRequest(`/chatbot/${deleteChatbotId}`, 'DELETE');
      if (response.data.code === 'F000') {
        showNotification('챗봇이 삭제되었습니다', 'success');
        return true; // 성공
      } else {
        showNotification('챗봇 삭제에 실패했습니다', 'error');
        return false; // 실패
      }
    } catch (error) {
      console.error('Error deleting chatbot:', error);
      throw error; // 에러는 호출자에게 전달
    }
  };

  return { postChatbotData, getChatbotData, deleteChatbot };
};

export default useFetchChatplay;
