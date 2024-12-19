import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import {
  chatbotDataChatPlay as useChatbotData,
  roomInfoStateChatplay as useRoomInfoState,
} from '@/shared/store/chatplay';

export default function GuideQuestions() {
  const { t } = useTranslation(['chatplay']);
  const chatbotData = useRecoilValue(useChatbotData);
  const roomInfoState = useRecoilValue(useRoomInfoState);
  const ChatbotClickedName = chatbotData.find((data) => data.chatbot_id === roomInfoState.checkId)?.name;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="text-3xl font-bold text-center">{ChatbotClickedName}</div>
        <div className="mt-1 mb-20 text-lg text-center text-gray">{t('지금_챗봇에게_대화해_보세요')}</div>
        <div className="max-w-[80%] xl:max-w-[40rem] mx-auto"></div>
      </div>
    </div>
  );
}
