import { useRecoilState, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';

import { showNotification } from '@/shared/utils/common-helper';
import { useChatPlayAxiosHooks } from '@/pages/Chatplay/hooks/useChatPlayAxiosHooks';
import useFetchRag from '../modal/ModalRetreivalSetting/model/useFetchRag';

import {
  roomInfoStateChatplay as useRoomInfoState,
  chatbotDataChatPlay as useChatbotData,
} from '@/shared/store/chatplay';

const useFetchChatplay = () => {
  const { t } = useTranslation(['common']);
  const { sendRequest } = useChatPlayAxiosHooks();
  const { getRagListData } = useFetchRag();

  const [roomInfoState, setRoomInfoState] = useRecoilState(useRoomInfoState);

  const setChatbotData = useSetRecoilState(useChatbotData);

  const postChatbotData = async (data: any) => {
    const isCreating = roomInfoState.checkId === 'create_option';

    try {
      const response = await sendRequest('/chatbot', 'POST', undefined, data);

      if (response && response.data.result) {
        if (response.data.code !== 'F002') {
          // const data = response.data.data;

          showNotification(
            isCreating ? t('common:정상적으로_등록되었습니다') : t('common:정상적으로_수정되었습니다'),
            'success',
          );
          await getChatbotData();
          await getRagListData(1);
        } else {
          showNotification(t('common:서버로_정상적인_데이터를_전달하지_못했습니다'), 'error');
        }
      } else {
        showNotification(t('common:서버로_정상적인_데이터를_전달하지_못했습니다'), 'error');
      }
    } catch (error) {
      console.error(error);

      showNotification(t('common:오류가_발생했습니다'), 'error');
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
          showNotification(t('common:현재_사용_가능한_데이터가_없습니다'), 'info');
          setRoomInfoState({
            ...roomInfoState,
            checkId: 'create_option',
          });
          setChatbotData([]);
        }
      } else {
        showNotification(response.data.message || t('common:데이터_로드_중_오류가_발생했습니다'), 'error');
      }
    } catch (error) {
      showNotification(t('common:데이터_로드_중_오류가_발생했습니다'), 'error');
      console.error('getChatbotData error', error);
    }
  };

  const deleteChatbot = async (deleteChatbotId: number) => {
    try {
      const response = await sendRequest(`/chatbot/${deleteChatbotId}`, 'DELETE');
      if (response.data.code === 'F000') {
        showNotification(t('common:챗봇이_삭제되었습니다'), 'success');
        getChatbotData();
        getRagListData(1);
        return true; // 성공
      } else {
        showNotification(t('common:챗봇_삭제에_실패했습니다'), 'error');
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
