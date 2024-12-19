import { useCallback } from 'react';
import { showNotification } from '@/shared/utils/common-helper';
import { useRestfulCustomAxios } from './useRestfulCustomAxios';

const useEmbeddingCheck = (chatbotList: any) => {
  const { sendRequest } = useRestfulCustomAxios();

  const entryEmbeddingCheck = useCallback(
    async (chatbotId: number) => {
      console.log(chatbotList);
      const params = { chatbot_id_list: chatbotId.toString() };
      const response = await sendRequest('/chatbotinfo/status', 'get', undefined, undefined, params);

      if (response && response.data) {
        const data = response.data.data;
        console.log(data);
        if (Array.isArray(data)) {
          const updateData = chatbotList.map((item: any) => {
            const matchedItem = data.find((v) => v.chatbot_id === item.id);
            return matchedItem
              ? {
                  ...item,
                  cnt_complete: matchedItem.cnt_complete,
                  cnt_error: matchedItem.cnt_error,
                  cnt_wait: matchedItem.cnt_wait,
                  total_count: matchedItem.total_count,
                }
              : item;
          });
          if (
            updateData[0] &&
            (updateData[0].cnt_complete === undefined ||
              updateData[0].cnt_error === undefined ||
              updateData[0].total_count === undefined)
          ) {
            return true;
          }
          if (updateData[0].cnt_complete + updateData[0].cnt_error === updateData[0].total_count) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        showNotification('Embedding 상태 체크에 실패하였습니다.', 'error');
        return false;
      }
    },
    [chatbotList],
  );

  return { entryEmbeddingCheck };
};

export default useEmbeddingCheck;
