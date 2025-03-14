import { ChangeEvent, Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';

import { cn } from '@/shared/utils/cn';

const PromptInput = ({
  value,
  setValue,
  disclaimer,
  onSend,
  // setConversations,
  sidebarState,
  conversations,
  // roomRef,
  handleNewConversation,
  // reconnect,
}: {
  value: string;
  setValue: (e: ChangeEvent<HTMLTextAreaElement> | string) => void;
  disclaimer?: string;
  onSend?: () => Promise<void>;
  // onSend?: () => void;
  conversations: IChatHistory;
  // setConversations: Dispatch<SetStateAction<IChatHistory>>;
  sidebarState: boolean;
  handleNewConversation: () => void;
  // roomRef: MutableRefObject<HTMLDivElement | null>;
  // reconnect: () => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      const newHeight = textarea.scrollHeight;
      const newRows = Math.min(Math.ceil(newHeight / lineHeight), 5);

      if (newRows <= 5) {
        textarea.style.height = `${newHeight}px`;
      } else {
        textarea.style.height = `${lineHeight * 5}px`;
      }
    };

    adjustHeight();
    textarea.addEventListener('input', adjustHeight);

    return () => {
      textarea.removeEventListener('input', adjustHeight);
    };
  }, [value]);

  return (
    <UIPromptInputContainer
      $sidebarState={sidebarState}
      $conversations={conversations}
      style={{
        background: 'linear-gradient(0deg, #FAFAFA 0%, #FAFAFA 80%, transparent 100%)', // 배경 색상 및 그라데이션
      }}
    >
      <UIPromptInputWithActionButoonsWrapper>
        {conversations.history.length !== 0 && (
          <UIActionButtonsWrapper>
            <UIActionButton
              onClick={() => handleNewConversation()}
              // onClick={() => {
              //   setValue('');
              //   setConversations({ history: [] });
              //   roomRef.current = null;
              //   // reconnect();
              // }}
            >
              <div className={cn('w-5 aspect-square')}>
                <IconRefresh />
              </div>
              {'새로운 대화 시작하기'}
            </UIActionButton>
          </UIActionButtonsWrapper>
        )}

        {/* 텍스트 입력 영역 */}
        <UIPromptInputWrapper>
          <UITextarea
            placeholder={'대화를 입력해주세요'}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
                e.preventDefault();
                onSend && onSend();
              }
            }}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            ref={textareaRef}
          />

          {/* 전송 버튼 */}
          <UISendButton onClick={onSend}>
            <IconSend />
          </UISendButton>
        </UIPromptInputWrapper>

        {/* 면책 조항 */}
        {disclaimer && <p className={cn('text-[#888888] text-xs px-5 text-center')}>{disclaimer}</p>}
      </UIPromptInputWithActionButoonsWrapper>
    </UIPromptInputContainer>
  );
};

export default PromptInput;

// ======================================
// Styled Components
// ======================================
// bottom-8
const UIPromptInputContainer = tw.div<{ $sidebarState: boolean; $conversations: IChatHistory }>`
  fixed
  ${({ $conversations }) => ($conversations.history.length !== 0 ? 'bottom-8' : 'top-96')}
  left-0
  w-full
  flex
  items-end
  justify-center
  pt-16
  transition-transform
  ${({ $sidebarState }) => ($sidebarState ? 'translate-x-[-150px]' : 'translate-x-0')}
  transition-all duration-100
`;

const UIPromptInputWithActionButoonsWrapper = tw.div`
  w-full max-w-[50rem] h-fit
  flex flex-col gap-2.5 justify-end
`;

const UIActionButtonsWrapper = tw.div`
  w-fit
  flex gap-2.5
`;

const UIActionButton = tw.button`
  w-fit flex gap-1.5 items-center text-xs
  border border-[#DDDDDD] rounded-lg outline-none
  px-2.5 py-2
  hover:bg-[#F4F4F4] hover:border-black
`;

const UIPromptInputWrapper = tw.div`
  flex justify-between items-center gap-4
  w-full h-auto rounded-lg bg-white
  border border-[#DDDDDD] p-3 pl-5
  focus-within:border-black
`;

const UITextarea = tw.textarea`
  w-full
  text-black
  text-sm
  outline-none
  resize-none
  leading-[1.3rem]
  min-h-[1.3rem]
  max-h-[calc(1.3rem*5)]
  scroll-y-auto
`;
const UISendButton = tw.button`
  w-6
  h-6
  p-0
  m-0
  text-black/50
  hover:text-black
`;

const IconSend = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.7479 20.8818C2.5594 20.8833 2.37688 20.8083 2.24009 20.6729L2.21958 20.6546C2.12085 20.5512 2.05119 20.4217 2.01939 20.2796C1.98759 20.1374 1.99523 19.9889 2.0399 19.8506L4 13L13.6669 11.9409L3.98911 11L2.0399 4.03228C1.97752 3.83642 1.99103 3.62255 2.07798 3.43717C2.16494 3.2518 2.31824 3.10952 2.50474 3.04077C2.58236 3.01336 2.66401 2.99954 2.74595 3.00001C2.84906 2.99969 2.95095 3.02189 3.04576 3.06421L21.3944 11.2276C21.4842 11.2661 21.566 11.322 21.6346 11.3937C21.7033 11.4653 21.7579 11.5506 21.7948 11.6444C21.832 11.7396 21.8505 11.8421 21.8495 11.945C21.8484 12.0478 21.828 12.1492 21.7889 12.2436C21.7132 12.4278 21.5719 12.5742 21.3954 12.6532L3.04283 20.8166C2.95001 20.8598 2.84952 20.8823 2.7479 20.8818Z"
      fill="#1A68B2"
    />
  </svg>
);

const IconRefresh = () => (
  <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 4C13.3137 4 16 6.68629 16 10C16 13.3137 13.3137 16 10 16C6.68629 16 4 13.3137 4 10C4 8.11516 4.86911 6.4333 6.22844 5.33333"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
    <path d="M4 5H7V8" stroke="black" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round" />
  </svg>
);
