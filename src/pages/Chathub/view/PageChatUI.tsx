import React from 'react';

import { replaceWithBr } from '@/shared/utils/chat';
import ico_user from '@/shared/assets/images/icons/ico_user_s.svg';
import EnterIcon from '@/shared/assets/images/icons/ico_enter.svg';
import { ChatMessage } from '@/pages/Chathub/components/Chat/view/ChatMessage';
import PromptBox from '@/pages/Chathub/components/Chat/view/PromptBox';
import ChatHistorySlider from '@/pages/Chathub/components/chatUI/view/ChatHistorySlider';
import ToggleMenu from '@/pages/Chathub/components/chatUI/view/ToggleMenu';
import FeedbackArea from '@/pages/Chathub/components/chatUI/view/FeedbackArea';
import { TailSpin } from 'react-loader-spinner';
import usePageChatUIViewModel from '../viewModel/usePageChatUIViewModel';
// import useLayoutChathubViewModel from '@/shared/layouts/LayoutChathub/viewModel/useLayoutChathubViewModel';
import Sidebar from '@/pages/Chathub/components/Chat/view/Sidebar';
import ThinkBox from '../components/chatUI/view/ThinkBox';

// type PageChatUIProps = {
//   handleChatLog: (chatroomId: number, seqNum: string | number | string[]) => Promise<void>;
// };

// const PageChatUI = ({ handleChatLog }: PageChatUIProps) => {
const PageChatUI = () => {
  const {
    editChat,
    chatbotImage,
    handleSelectChatHistory,
    selectedChatHistory,
    gptChatHistoryState,
    userAuthority,
    roomInfoState,
    handleFeedbackArea,
    openFeedbackArea,
    roomStatusState,
    gptChatHistoryStreamState,
    refChatlist,
    isMakingQuestions,
    sequenceQuestionsList,
    handleSelectQuestion,
    siderBarOpen,
    logData,
    activeSideTab,
    setActiveSideTab,
    handleChatLog,
  } = usePageChatUIViewModel();
  // const { handleChatLog } = useLayoutChathubViewModel();
  return (
    <div className="page_chat">
      <div className="chatting_box">
        <div className="flex items-center mt-8 min-w-0">
          <ToggleMenu handleEdit={editChat} chatbotImage={chatbotImage} />

          <div className="w-[1px] h-10 bg-bd-gray" />
          <ChatHistorySlider onClick={handleSelectChatHistory} selectedChatHistory={selectedChatHistory} />
        </div>
        <div id="chatbotContentBody" className="h-[calc(100vh-21rem)] min-h-[150px] overflow-y-auto mt-2 scroll-pr-6">
          <div className="flex flex-col mx-auto text-[#111111] text-base text-left break-keep">
            {gptChatHistoryState &&
              gptChatHistoryState.history.map((item, index) => {
                if (item.role == 'user') {
                  return (
                    <div
                      key={`chatuser_${index}`}
                      className="flex w-full p-7 rounded-[0.625rem] bg-[#e7ecf1] mt-7 text-sm"
                    >
                      <div className="h-full w-28">
                        <div className="flex flex-row justify-center items-start">
                          <img src={ico_user} alt="user" />
                        </div>
                      </div>
                      <p
                        className="w-full"
                        dangerouslySetInnerHTML={{
                          __html: replaceWithBr(item.content as string),
                        }}
                      />
                      {userAuthority && (
                        <button
                          onClick={() => handleChatLog(roomInfoState.roomId, item.seq || item.seq_num)}
                          className="cursor-pointer hover:bg-gray-100 rounded"
                        >
                          [더보기]
                        </button>
                      )}
                    </div>
                  );
                } else if (item.role == 'assistant') {
                  // const lastAssistantIndex = gptChatHistoryState.history.reduce((acc, curr, idx) => {
                  //   return curr.role === 'assistant' ? idx : acc;
                  // }, -1);

                  // if (gptChatHistoryStreamState && index === lastAssistantIndex) {
                  //   return null;
                  // }
                  return (
                    <React.Fragment key={`chatassistant_${index}`}>
                      <div className="flex w-full p-7 rounded-[0.625rem] bg-[#fff] mt-7 text-sm">
                        <div className="h-full w-28">
                          <div className="flex flex-col items-center justify-center">
                            <img className="w-[30px] h-[30px]" src={chatbotImage} alt="Chathub" />
                          </div>
                        </div>
                        <div className="flex flex-col w-full">
                          {typeof item.content === 'string' && item.content.includes('<think>') && (
                            <ThinkBox content={item.content} />
                          )}
                          <ChatMessage
                            text={
                              typeof item.content === 'string'
                                ? item.content.replace(/<think>.*?<\/think>/s, '').trim()
                                : String(item.content)
                            }
                          />
                        </div>
                      </div>
                      <div className="mt-2 ml-10">
                        <div
                          className="flex items-center cursor-pointer w-fit"
                          onClick={() => handleFeedbackArea(index)}
                        >
                          <img src={EnterIcon} alt="enter" className="mr-2" />
                          <div className="text-sm text-bd-darkgray">피드백 남기기</div>
                        </div>
                        {openFeedbackArea[index] && (
                          <FeedbackArea
                            index={index}
                            seq={item.seq as number}
                            isOpen={openFeedbackArea[index]}
                            handleFeedbackArea={handleFeedbackArea}
                          />
                        )}
                      </div>
                    </React.Fragment>

                    // <React.Fragment key={`chatassistant_${index}`}>
                    //   <div className="flex w-full p-7 rounded-[0.625rem] bg-[#fff] mt-7 text-sm">
                    //     <div className="h-full w-28">
                    //       <div className="flex flex-col items-center justify-center">
                    //         <img className="w-[30px] h-[30px]" src={chatbotImage} alt="Chathub" />
                    //       </div>
                    //     </div>
                    //     <div className="flex flex-col w-full">
                    //       <ChatMessage text={item.content as string} />
                    //     </div>
                    //   </div>
                    //   <div className="mt-2 ml-10">
                    //     <div
                    //       className="flex items-center cursor-pointer w-fit"
                    //       onClick={() => handleFeedbackArea(index)}
                    //     >
                    //       <img src={EnterIcon} alt="enter" className="mr-2" />
                    //       <div className="text-sm text-bd-darkgray">피드백 남기기</div>
                    //     </div>
                    //     {openFeedbackArea[index] && (
                    //       <FeedbackArea
                    //         index={index}
                    //         seq={item.seq as number}
                    //         isOpen={openFeedbackArea[index]}
                    //         handleFeedbackArea={handleFeedbackArea}
                    //       />
                    //     )}
                    //   </div>
                    // </React.Fragment>
                  );
                }
              })}

            {gptChatHistoryStreamState && roomStatusState.chatUiState !== 'FINISH' && (
              <div className="flex w-full p-7 rounded-[0.625rem] bg-[#fff] mt-7 text-sm">
                <div className="h-full w-28">
                  <div className="flex flex-col items-center justify-start">
                    <img className="w-[30px]" src={chatbotImage} alt="chatgpt" />
                  </div>
                </div>
                <ChatMessage text={gptChatHistoryStreamState} type="STREAM" />
              </div>
            )}

            <div ref={refChatlist}></div>
          </div>
          <div className="flex justify-end my-3">
            {isMakingQuestions ? (
              <div className="h-[50px] flex justify-start w-[80%]">
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
                  className={`items-center justify-center ml-4 py-2 px-4 w-64 h-[3.5rem] rounded-2xl border border-primary bg-white cursor-pointer text-bd-darkgray text-sm text-ellipsis text-primary hover:bg-primary hover:text-white`}
                  onClick={() => handleSelectQuestion(item['question'])}
                >
                  <span className="block overflow-hidden max-h-[3rem]">{item['question']}</span>
                </button>
              ))
            ) : (
              <div className="h-[3rem]"></div>
            )}
          </div>
        </div>
        <PromptBox />
      </div>
      <Sidebar
        sidebarState={siderBarOpen}
        handleSideBar={editChat}
        logData={logData}
        activeTab={activeSideTab}
        onChangeTab={setActiveSideTab}
      />
    </div>
  );
};
export default PageChatUI;
