// ======================================
// Imports
// ======================================
// import 'github-markdown-css/github-markdown.css';

import { AnimatePresence, motion } from 'framer-motion';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useRecoilValue } from 'recoil';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import tw from 'tailwind-styled-components';
import { useTranslation } from 'react-i18next';

import { userLoginState } from '@/shared/store/onpromise';
import { cn } from '@/shared/utils/cn';

// ======================================
// Conversations Component
// ======================================
const Conversations = ({
  conversations,
  setConversations,
  llmDone,
  isProcessing,
  selectedModel,
}: {
  conversations: IConversation[];
  setConversations: Dispatch<SetStateAction<IConversation[]>>;
  llmDone: boolean;
  isProcessing: boolean;
  selectedModel: string;
}) => {
  const userState = useRecoilValue(userLoginState);
  const conversationLength = useMemo(() => conversations.length, [conversations]);
  const userName = useMemo(() => userState?.name, [userState]);

  return (
    <UIConversations>
      {conversations.map((conversation, index) => {
        const isLast = index === conversationLength - 1;

        return conversation.role === 'user' ? (
          <UserMessage key={index} conversation={conversation} userName={userName} />
        ) : (
          <AssistantMessage
            model={selectedModel}
            key={index}
            setConversations={setConversations}
            llmDone={llmDone}
            isLast={isLast}
            conversation={conversation}
            isProcessing={isProcessing}
          />
        );
      })}
      <div className="w-full h-8 opacity-0" ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })}>
        &nbsp;
      </div>
    </UIConversations>
  );
};

export default Conversations;

// ======================================
// AssistantMessage Component
// ======================================
const UserMessage = ({ conversation, userName }: { conversation: IConversation; userName: string }) => (
  <UIUserMessage
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    transition={{ duration: 0.3 }}
  >
    <div className={cn('text-black font-bold text-sm')}>{userName}</div>
    <div className="!bg-transparent leading-7 markdown-body">
      <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
        {conversation.content}
      </ReactMarkdown>
    </div>
  </UIUserMessage>
);
// ======================================
// AssistantMessage Component
// ======================================
const AssistantMessage = ({
  model,
  llmDone,
  isLast,
  conversation,
  setConversations,
  isProcessing,
}: {
  model: string;
  llmDone: boolean;
  isLast: boolean;
  conversation: IConversation;
  setConversations: Dispatch<SetStateAction<IConversation[]>>;
  isProcessing: boolean;
}) => {
  const { t } = useTranslation(['aiChat', 'button']);

  const [isCopied, setIsCopied] = useState(false);
  const [isThrottled, setIsThrottled] = useState(false);

  const fallbackCopyToClipboard = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setIsCopied(false);
    } catch (err) {
      setIsCopied(false);
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const handleCopy = () => {
    if (isThrottled) return;

    setIsThrottled(true);

    // 클립보드 API 지원 여부 확인
    if (navigator.clipboard && window.isSecureContext) {
      // HTTPS 환경에서 클립보드 API 사용
      navigator.clipboard
        .writeText(conversation.content)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
            setIsThrottled(false);
          }, 2000);
        })
        .catch((err) => {
          console.error('Failed to copy content using clipboard API: ', err);
          // 클립보드 API 실패 시 fallbackCopyToClipboard 사용
          fallbackCopyToClipboard(conversation.content);
          setIsThrottled(false);
        });
    } else {
      // HTTP 환경에서 fallback 사용
      console.warn('Clipboard API not available, using fallback');
      fallbackCopyToClipboard(conversation.content);
      setTimeout(() => {
        setIsCopied(false);
        setIsThrottled(false);
      }, 2000);
    }
  };

  const [dotCount, setDotCount] = useState(1);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!llmDone && isLast) {
      interval = setInterval(() => {
        setDotCount((prev) => (prev % 5) + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [llmDone, isLast]);

  const statusText = useMemo(
    () =>
      !llmDone && isLast
        ? `${t('aiChat:답변을_생성하고_있습니다')}${'.'.repeat(dotCount)}`
        : t('aiChat:답변_생성이_완료되었습니다'),
    [llmDone, isLast, dotCount],
  );

  const showMessage = useMemo(() => {
    console.log('isLast:', isLast);
    console.log('llmDone:', llmDone);
    console.log('isProcessing:', isProcessing);
    let status = !isLast || (isLast && llmDone) || (isLast && isProcessing);
    return status;
  }, [isLast, llmDone, isProcessing]);

  return (
    showMessage && (
      <UIAssistantMessage
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        <div className={cn('w-full', 'flex justify-between items-center')}>
          <div className={cn('text-black font-bold text-sm flex items-center gap-1')}>
            <span>{model}</span>
            <span className={cn('text-[#888888] font-normal')}>&middot; {statusText}</span>
          </div>
          <div className="flex flex-row items-center h-8 gap-3 max-w-48 ">
            <UIRefreshButton
              disabled={!llmDone}
              onClick={() => {
                setConversations((prev) => {
                  const index = prev.findIndex((item) => item === conversation);
                  return prev.slice(0, index);
                });
              }}
              className="w-20"
            >
              <IconRefreshDouble />

              <span className="flex items-center text-xs flex-nowrap text-nowrap">{t('button:새로고침')}</span>
            </UIRefreshButton>
            <UICopyButton
              className={cn(isThrottled && 'cursor-not-allowed opacity-50 h-full ')}
              disabled={!llmDone || isThrottled}
              onClick={handleCopy}
            >
              <AnimatePresence>{isCopied ? <IconCheck /> : <IconCopy />}</AnimatePresence>
            </UICopyButton>
          </div>
        </div>
        <div className="leading-7 markdown-body">
          <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
            {conversation.content}
          </ReactMarkdown>
        </div>
      </UIAssistantMessage>
    )
  );
};

// ======================================
// Styled Components (UI Conatiners)
// ======================================
const UIUserMessage = tw(motion.div)`
  flex
  flex-col
  gap-2.5
  text-base
`;

const UIAssistantMessage = tw(motion.div)`
  bg-white
  w-full h-fit
  border border-[#DDDDDD] rounded-lg
  p-5
  relative flex flex-col gap-2.5
  text-base
`;

const UIConversations = tw.div`
  flex
  flex-col
  max-w-[52rem]
  w-full
  gap-[3.125rem]
  h-full
  overflow-y-auto
  mb-40
  pl-4
  pr-2
`;

const UIRefreshButton = tw.button`
  w-fit h-[1.875rem] py-1 px-2
  rounded-md border border-[#DDDDDD]
  flex flex-nowrap items-center gap-1
  disabled:opacity-50 disabled:cursor-not-allowed
`;

const UICopyButton = tw.button`
  w-[1.875rem] h-[1.875rem] aspect-square p-1
  rounded-md border border-[#DDDDDD]
  disabled:opacity-50 disabled:cursor-not-allowed
`;

// ======================================
// Icons
// ======================================
const IconRefreshDouble = () => (
  <svg width="100%" height="100%" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="18" height="18" fill="white" />
    <path
      d="M3 9C3 5.68629 5.5184 3 8.625 3C10.392 3 11.9688 3.86911 13 5.22844"
      stroke="#111111"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
    <path d="M14 3L14 6L11 6" stroke="#111111" strokeWidth="1.5" strokeLinecap="square" />
    <path
      d="M15 9C15 12.3137 12.4816 15 9.375 15C7.60796 15 6.03122 14.1309 5 12.7716"
      stroke="#111111"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
    <path d="M4 15L4 12L7 12" stroke="#111111" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
);

const IconCopy = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    width="100%"
    height="100%"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13 3H4V12" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M7 6H16V14C16 15.1046 15.1046 16 14 16H9C7.89543 16 7 15.1046 7 14V6Z"
      stroke="#111111"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

const IconCheck = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    width="100%"
    height="100%"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 10L8 14L16 6" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </motion.svg>
);
