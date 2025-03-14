import ThinkBox from '../../components/chatUI/view/ThinkBox';
import { useMemo, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useRecoilValue } from 'recoil';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { cn } from '@/shared/utils/cn';
import { userLoginState } from '@/shared/store/onpromise';
import icon_up from '@/shared/assets/images/icons/icon_up.svg';
import { TailSpin } from 'react-loader-spinner';
// import Zoom from 'react-medium-image-zoom';
// import 'react-medium-image-zoom/dist/styles.css';
import { showNotification } from '@/shared/utils/common-helper';

const ChatConversations = ({
  conversations,
  handleChatLog,
  isMakingSeqQuestions,
  sequenceQuestionsList,
  setIsModalVisible,
  streamConversation,
  sidebarState,
  setFeedbackDetail,
  chatRoomNum,
  // llmDone,
  // isProcessing,
}: {
  conversations: IChatHistory;
  handleChatLog: (chatroomId: number, seqNum: string | number | string[]) => void;
  isMakingSeqQuestions: boolean;
  setIsModalVisible: (isModalVisible: boolean) => void;
  sequenceQuestionsList: IChathubQuestions[];
  streamConversation: string;
  sidebarState: boolean;
  setFeedbackDetail: (data: feedbackContent) => void;
  chatRoomNum: number | null;
  // llmDone: boolean;
  // isProcessing: boolean;
}) => {
  const conversationLength = useMemo(() => conversations?.history?.length ?? 0, [conversations]);
  // const conversationLength = useMemo(() => conversations.history.length, [conversations]);
  const userState = useRecoilValue(userLoginState);
  const userName = useMemo(() => userState?.name, [userState]);
  const isStreaming = streamConversation !== '';

  return (
    // <UIConversations>
    <UIConversations $sidebarState={sidebarState} key={`conversation_set_${chatRoomNum}`}>
      {conversations.history &&
        conversations.history.map((conversation, index) => {
          const isLast = index === conversationLength - 1;

          if (isStreaming && index === conversationLength - 1 && conversation.role === 'assistant') {
            return null;
          }
          return conversation.role === 'user' ? (
            <UserMessage key={`user_${index}`} conversation={conversation} userName={userName} />
          ) : (
            <>
              <AssistantMessage
                key={`assistant_${index}`}
                // llmDone={llmDone}
                isLast={isLast && !isStreaming}
                conversation={conversation}
                ChatLog={handleChatLog}
                setIsModalVisible={setIsModalVisible}
                feedbackDetail={setFeedbackDetail}
                // isProcessing={isProcessing}
              />
              {isLast && !isStreaming ? (
                <div className="flex flex-col text-baseflex flex-col w-full mt-[-3.125rem] bg-white w-full h-fit border border-[#DDDDDD] rounded-lg p-5 relative">
                  <h4 className="font-bold mb-2">&#x27A4; 관련 질문</h4>
                  {isMakingSeqQuestions ? (
                    <div className="h-[50px] flex justify-start w-full">
                      <TailSpin
                        height="40"
                        width="40"
                        color="#4262FF"
                        ariaLabel="tail-spin-loading"
                        radius="4"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                      />
                    </div>
                  ) : sequenceQuestionsList && sequenceQuestionsList.length > 0 ? (
                    sequenceQuestionsList.slice(0, 3).map((item, index) => (
                      <button
                        type="button"
                        key={`sequenceQ_${index}`}
                        className={`w-full py-2 px-4 border border-[#DDDDDD] text-left text-black bg-[#F4F6F8] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 
                          ${index === 0 ? 'rounded-t-lg' : ''}
                          ${index === 2 ? 'rounded-b-lg' : ''}
                        `}
                        // onClick={() => handleSelectQuestion(item['question'])}
                      >
                        <span className="block overflow-hidden text-sm">{item['question']}</span>
                      </button>
                    ))
                  ) : (
                    <div className="h-[3rem]">
                      <span>MAAL Chatbot에게 새로운 질문을 해주세요</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col w-full"></div>
              )}
            </>
          );
        })}
      {isStreaming && (
        <>
          <AssistantMessage
            key="streaming_message"
            isLast={true}
            conversation={{
              role: 'assistant',
              content: streamConversation,
              seq: Date.now(),
              room_id:
                conversations.history.length > 0 ? conversations.history[conversations.history.length - 1].room_id : 0,
            }}
            ChatLog={handleChatLog}
            setIsModalVisible={setIsModalVisible}
            feedbackDetail={setFeedbackDetail}
          />
        </>
      )}
      {isStreaming || (isMakingSeqQuestions && sequenceQuestionsList && sequenceQuestionsList.length > 0) ? (
        <div className="w-full h-12 opacity-0" ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })}>
          &nbsp;
        </div>
      ) : (
        <div className="w-full h-12 opacity-0"> &nbsp; </div>
      )}
    </UIConversations>
  );
};

export default ChatConversations;

const UserMessage = ({ conversation, userName }: { conversation: IChatHistoryType; userName: string }) => {
  const textContent = Array.isArray(conversation.content)
    ? conversation.content.join(' ')
    : String(conversation.content);

  return (
    <UIUserMessage
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
    >
      <div className={cn('text-black font-bold text-sm')}>{userName}</div>
      <div className="!bg-transparent leading-7 markdown-body">
        <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
          {textContent}
        </ReactMarkdown>
      </div>
    </UIUserMessage>
  );
};

// ======================================
// AssistantMessage Component
// ======================================
const AssistantMessage = ({
  // model,
  // llmDone,
  // isLast,
  conversation,
  ChatLog,
  setIsModalVisible,
  feedbackDetail,
  // isProcessing,
}: {
  // model: string;
  // llmDone: boolean;
  ChatLog: (chatroomId: number, seqNum: string | number | string[]) => void;
  isLast: boolean;
  setIsModalVisible: (isModalVisible: boolean) => void;
  conversation: IChatHistoryType;
  feedbackDetail: (data: feedbackContent) => void;

  // isProcessing: boolean;
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isThrottled, setIsThrottled] = useState(false);

  const handleFeedback = (roomId: number, seqNumber: number) => {
    setIsModalVisible(true);
    feedbackDetail({
      room_id: roomId,
      seq: seqNumber,
    });
  };
  const handleLog = (chatroomId: any, seqNum: any) => {
    ChatLog(chatroomId, seqNum);
    // ChatLog(0, 0);
  };
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

  const handleCopy = (text: string) => {
    if (isThrottled) return;

    setIsThrottled(true);

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
            setIsThrottled(false);
          }, 2000);
        })
        .catch((err) => {
          console.error('Failed to copy content using clipboard API: ', err);
          fallbackCopyToClipboard(text);
          setIsThrottled(false);
        });
    } else {
      console.warn('Clipboard API not available, using fallback');
      fallbackCopyToClipboard(text);
      setTimeout(() => {
        setIsCopied(false);
        setIsThrottled(false);
      }, 2000);
    }
  };

  // const [dotCount, setDotCount] = useState(1);
  // useEffect(() => {
  //   let interval: NodeJS.Timeout;
  //   if (!llmDone && isLast) {
  //     interval = setInterval(() => {
  //       setDotCount((prev) => (prev % 5) + 1);
  //     }, 1000);
  //   }
  //   return () => clearInterval(interval);
  // }, [llmDone, isLast]);

  // const statusText = useMemo(
  //   () =>
  //     !llmDone && isLast
  //       ? `${'답변을 생성하고 있습니다'}${'.'.repeat(dotCount)}`
  //       : '답변 생성이 완료되었습니다'),
  //   [llmDone, isLast, dotCount],
  // );

  // const showMessage = useMemo(() => {
  //   console.log('isLast:', isLast);
  //   console.log('llmDone:', llmDone);
  //   console.log('isProcessing:', isProcessing);
  //   let status = !isLast || (isLast && llmDone) || (isLast && isProcessing);
  //   return status;
  // }, [isLast, llmDone, isProcessing]);

  return (
    <UIAssistantMessage
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
    >
      <div className={cn('w-full', 'flex justify-between items-center')}>
        <div className={cn('text-black font-bold text-sm flex items-center gap-1')}>
          <span>hi</span>
        </div>
        <div className="flex flex-row items-center h-8 gap-3 max-w-48 ">
          <UICopyButton
            className={cn(isThrottled && 'cursor-not-allowed opacity-50 h-full ')}
            onClick={() => handleCopy(String(conversation.content))}
          >
            <AnimatePresence>{isCopied ? <IconCheck /> : <IconCopy />}</AnimatePresence>
          </UICopyButton>
          <UIButton
            className="h-full"
            onClick={() => handleFeedback(conversation.room_id as number, conversation.seq as number)}
          >
            <span>Feedback</span>
          </UIButton>
          <UIButton className="h-full" onClick={() => handleLog(conversation.room_id, conversation.seq)}>
            <span>Log</span>
          </UIButton>
        </div>
      </div>
      <div className="leading-7 markdown-body">
        {typeof conversation.content === 'string' && conversation.content.includes('<think>') && (
          <ThinkBox content={conversation.content} />
        )}
        <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
          {typeof conversation.content === 'string'
            ? conversation.content.replace(/<think>.*?<\/think>/s, '').trim()
            : String(conversation.content)}
        </ReactMarkdown>
      </div>

      {(Array.isArray(conversation.linkSource) && conversation.linkSource.length > 0) ||
      (Array.isArray(conversation.ragSource) && conversation.ragSource.length > 0) ||
      (Array.isArray(conversation.images) && conversation.images.length > 0) ? (
        <hr className="border-t-2 border-black my-4" />
      ) : null}

      {Array.isArray(conversation.ragSource) && conversation.ragSource.length > 0 ? (
        <div className="mt-4">
          <h4 className="font-bold mb-2">&#x27A4; RAG 출처</h4>
          {conversation.ragSource.map((source, index) => {
            const [isOpen, setIsOpen] = useState(false);
            return (
              <details
                key={`ragsource_${index}`}
                className="mb-2 bg-[#F4F6F8] p-3 rounded-lg shadow hover:bg-gray-100 transition"
                onToggle={(e) => setIsOpen(e.currentTarget.open)}
              >
                <summary className="cursor-pointer text-sm font-semibold flex justify-between items-center">
                  <span className="truncate w-full">{typeof source === 'string' ? source : source.title}</span>
                  <img
                    className={`ico_up transition-transform duration-200 ${isOpen ? 'rotate-0' : 'rotate-180'}`}
                    src={icon_up}
                    alt={isOpen ? '접기' : '펼치기'}
                  />{' '}
                </summary>
                <div className="mt-1 text-xs text-gray-500 border-t border-[#D1D5DB] pt-2">
                  {typeof source === 'string' ? source : source.content}
                </div>
                {typeof source !== 'string' && (
                  <a href={source.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500">
                    전문 보기
                  </a>
                )}
              </details>
            );
          })}
        </div>
      ) : null}

      {Array.isArray(conversation.linkSource) && conversation.linkSource.length > 0 ? (
        <LinkSourceSection linkSource={conversation.linkSource as ChatSource[]} />
      ) : null}
      {Array.isArray(conversation.images) && conversation.images.length > 0 ? (
        <ImageSection images={conversation.images as string[]} />
      ) : null}
    </UIAssistantMessage>
  );
  // );
};

const LinkSourceSection = ({ linkSource }: { linkSource: ChatSource[] }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleLinks = showAll ? linkSource : linkSource.slice(0, 3);

  return (
    <div className="mt-4">
      <h4 className="font-bold mb-2">&#x27A4; 출처</h4>
      <SourceGrid>
        {visibleLinks.map((src, index) => (
          <SourceCard key={index}>
            <a href={src.link} target="_blank" rel="noopener noreferrer" className="block h-full">
              <div className="flex flex-col mb-3">
                <h5 className="font-semibold text-sm mb-1 truncate">{src.title}</h5>
                {src.content && <p className="text-xs text-gray-500 mb-1 truncate">{src.content}</p>}
              </div>

              <p className="text-xs text-[#BCC0C2] truncate">{src.link}</p>
            </a>
          </SourceCard>
        ))}
        {linkSource.length > 3 && (
          <MoreButton onClick={() => setShowAll(!showAll)}>
            {showAll ? '닫기' : `+ ${linkSource.length - 3} 더보기`}
          </MoreButton>
        )}
      </SourceGrid>
    </div>
  );
};
const ImageSection = ({ images }: { images: string[] }) => {
  const [showAll, setShowAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [downloadError, setDownloadError] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const visibleImages = showAll ? images : images.slice(0, 3);

  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image);
    setSelectedImageIndex(index);
    setIsModalOpen(true);
    setDownloadError(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel(zoomLevel + 0.1);
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(0.5, zoomLevel - 0.1));
  };

  const convertImageToBase64 = async (url: string) => {
    // AllOrigins API를 사용하여 이미지 CORS 우회
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const handleSaveAsPng = async () => {
    if (!selectedImage) return;
    try {
      let base64Image = selectedImage;

      if (selectedImage.startsWith('https')) {
        base64Image = (await convertImageToBase64(selectedImage)) as string;
      }
      const img = new Image();
      img.src = base64Image as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'downloaded-image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
          }
        }, 'image/png');
      };
    } catch (error) {
      setDownloadError(true);
      showNotification('이미지를 가져오는 중 오류 발생', 'error');
    }
  };

  return (
    <div className="mt-4">
      <h4 className="font-bold mb-2">&#x27A4; 이미지</h4>
      <ImageGridContainer>
        {visibleImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`image-${index}`}
            className="w-full h-32 object-cover rounded-md shadow cursor-pointer transition-transform hover:scale-105"
            onClick={() => handleImageClick(image, index)}
          />
        ))}
        {images.length > 3 && (
          <ImageMoreButton onClick={() => setShowAll(!showAll)}>
            {showAll ? '닫기' : `+ ${images.length - 3} 더보기`}
          </ImageMoreButton>
        )}
      </ImageGridContainer>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-[90vw] max-w-[25rem] h-[80vh] max-h-[25rem]">
            {/* <div className="bg-white p-6 rounded-lg shadow-lg relative w-[90vw] max-w-[800px] h-[80vh] max-h-[800px]"> */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200"
              onClick={handleCloseModal}
            >
              ✖
            </button>

            <div className="h-[90%] overflow-auto mt-4 flex justify-center items-center">
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.3s ease',
                }}
              >
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt={`image-${selectedImageIndex}`}
                  className="max-w-[90%] max-h-[90%] mx-auto object-contain"
                />
              </div>
            </div>

            <div className="flex flex-col justify-between items-stretch mt-2 px-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center bg-gray-300 rounded-full w-[88px] h-[30px] shadow-md">
                  <button
                    className="flex items-center justify-center w-[44px] h-[30px] bg-gray-400 rounded-l-full hover:bg-gray-500"
                    onClick={handleZoomOut}
                    aria-label="Zoom out"
                  >
                    <span className="text-xl font-bold">−</span>
                  </button>
                  <button
                    className="flex items-center justify-center w-[44px] h-[30px] bg-gray-400 rounded-r-full hover:bg-gray-500"
                    onClick={handleZoomIn}
                    aria-label="Zoom in"
                  >
                    <span className="text-xl font-bold">+</span>
                  </button>
                </div>

                <button
                  className="flex items-center justify-center w-[80px] h-[30px] bg-green-500 text-white rounded-full shadow-md hover:bg-green-600"
                  onClick={handleSaveAsPng}
                  aria-label="Save image"
                >
                  저장
                </button>
              </div>

              {downloadError && (
                <div className="text-red-500 text-sm mt-2 text-center">
                  이미지 다운로드 실패. 외부 이미지의 보안 제한으로 인해 다운로드할 수 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// const ImageSection = ({ images }: { images: string[] }) => {
//   const [showAll, setShowAll] = useState(false);
//   const visibleImages = showAll ? images : images.slice(0, 3);

//   return (
//     <div className="mt-4">
//       <h4 className="font-bold mb-2">&#x27A4; 이미지</h4>
//       <ImageGridContainer>
//         {visibleImages.map((image, index) => (
//           <img key={index} src={image} alt={`image-${index}`} className="w-full h-32 object-cover rounded-md shadow" />
//         ))}
//         {images.length > 3 && (
//           <ImageMoreButton onClick={() => setShowAll(!showAll)}>
//             {showAll ? '닫기' : `+ ${images.length - 3} 더보기`}
//           </ImageMoreButton>
//         )}
//       </ImageGridContainer>
//     </div>
//   );
// };

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
// const UIConversations = tw(motion.div)`
const UIConversations = tw.div<{ $sidebarState: boolean }>`
  flex
  flex-col
  max-w-[52rem]
  w-full
  gap-[3.125rem]
  h-full
  overflow-y-auto
  mb-24
  pl-4
  pr-2
  transition-transform
  ${({ $sidebarState }) => ($sidebarState ? 'translate-x-[-150px]' : 'translate-x-0')}
  transition-all duration-100
  [&::-webkit-scrollbar]:hidden
`;

// const UIRefreshButton = tw.button`
//   w-fit h-[1.875rem] py-1 px-2
//   rounded-md border border-[#DDDDDD]
//   flex flex-nowrap items-center gap-1
//   disabled:opacity-50 disabled:cursor-not-allowed
// `;

const UICopyButton = tw.button`
  w-[1.875rem] h-[1.875rem] aspect-square p-1
  rounded-md border border-[#DDDDDD]
  disabled:opacity-50 disabled:cursor-not-allowed
`;

const UIButton = tw.button`
  h-8 px-3 
  rounded-md border border-[#DDDDDD]
  text-sm font-medium 
  hover:bg-gray-100 active:bg-gray-200 
  disabled:opacity-50 disabled:cursor-not-allowed
`;

const SourceGrid = tw.div`
  grid grid-cols-4 gap-2
`;

const SourceCard = tw.div`
  bg-[#F4F6F8] p-5 rounded-lg shadow hover:bg-gray-100 transition
`;

const MoreButton = tw.button`
  bg-[#F4F6F8] p-2 rounded-lg text-sm font-medium text-[#7B8188] hover:bg-gray-300 transition
`;

const ImageGridContainer = tw.div`
  grid grid-cols-4 gap-2
`;

const ImageMoreButton = tw.button`
  bg-[#F4F6F8] p-2 rounded-lg text-sm font-medium text-[#7B8188] hover:bg-gray-300 transition
`;

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
