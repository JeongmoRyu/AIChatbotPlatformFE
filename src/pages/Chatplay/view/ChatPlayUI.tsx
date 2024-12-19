import { useRecoilValue } from 'recoil';

import ChatPlayGuide from './ChatPlayGuide';
import GuideQuestions from './GuideQuestions';

import { roomInfoStateChatplay as useRoomInfoState } from '@/shared/store/chatplay';

function ChatPlayUI({ isHidden }: ChatPlayUIProps) {
  const roomInfoState = useRecoilValue(useRoomInfoState);

  return (
    <>
      {!isHidden && (
        <div className="content-center h-full my-12 overflow-y-auto">
          {Number(roomInfoState.checkId) > 0 ? <GuideQuestions /> : <ChatPlayGuide />}
        </div>
      )}
    </>
  );
}

export default ChatPlayUI;
