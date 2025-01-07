import { useTranslation } from 'react-i18next';
import ChatPlayNameSelectBox from './ChatPlayNameSelectBox';
import { useEffect, useState } from 'react';

function ChatPlayNameSelect({ socket }: any) {
  const { t, ready } = useTranslation(['chatplay']);
  const [isTranslationReady, setIsTranslationReady] = useState(false);

  useEffect(() => {
    if (ready) {
      setIsTranslationReady(true);
    }
  }, [ready]);

  if (!isTranslationReady) return null;

  return (
    <div className="w-full bg-white">
      <ChatPlayNameSelectBox
        id="ChatPlayNameSelect"
        boxClassName="w-80 h-[60px] laptop:w-full "
        placeholder={t('chatplay:챗봇_목록_열기')}
        socket={socket}
      />
    </div>
  );
}

export default ChatPlayNameSelect;
