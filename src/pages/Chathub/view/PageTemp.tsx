import { Container } from '@/pages/Home/view/PageHome';
import { AnimatePresence } from 'framer-motion';
import { usePageNewChatUIViewModel } from '../viewModel/usePageNewChatUIViewModel';
import Sidebar from '../components/NewChat/Sidebar';
// import PromptInput from './partials/PromptInput';
import icon_up from '@/shared/assets/images/icons/icon_up.svg';
import PromptInput from './partials/PromptInput';
import TextModal from '@/pages/Account/components/modal/view/TextModal';
import ChatroomDateList from '../components/NewChat/ChatroomDateList';

const PageTemp = () => {
  const {
    // llmModelList,
    // sampleQuestions,
    // selectedModel,
    // setSelectedModel,
    question,
    setQuestion,
    conversations,
    ConversationPanel,
    handleSendMessage,
    // setConversations,
    // llmDone,
    // handleNewConversation,
    // isProcessing,
    siderBarOpen,
    logData,
    handleChatLog,
    editChat,
    leftSidebarOpen,
    toggleLeftSidebar,
    isMakingSeqQuestions,
    sequenceQuestionsList,
    isModalVisible,
    handleModalClose,
    handleFeedbackApi,
    setIsModalVisible,
    handleDateListChatroomSelect,
    // setStreamConversation,
    streamConversation,
    setFeedbackDetail,
    // selectedChatroomRef,
    handleNewConversation,
    selectedChatroom,
  } = usePageNewChatUIViewModel();

  return (
    <div className="flex flex-row w-full h-full relative">
      {/* Left Sidebar Content */}
      <div
        className={`fixed top-16 left-0 h-full bg-white transition-transform duration-300 z-50 w-60 ${
          leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-2">
          <h2 className="text-md font-semibold">이전 대화 목록</h2>
        </div>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-grow overflow-y-auto min-h-0">
            <ChatroomDateList onSelectChatroom={handleDateListChatroomSelect} conversations={conversations} />
          </div>
        </div>
        {/* <div className="flex-grow overflow-y-auto">
          <ChatroomDateList onSelectChatroom={handleDateListChatroomSelect} conversations={conversations} />
        </div> */}
      </div>

      <button
        className={`fixed top-16 ${leftSidebarOpen ? 'left-60' : 'left-1'} bg-white border border-[#f4f6f8] p-4 z-50 flex items-center hover:bg-gray-100`}
        onClick={toggleLeftSidebar}
      >
        <img
          className={`transition-transform duration-200 ${leftSidebarOpen ? 'rotate-[270deg]' : 'rotate-[90deg]'}`}
          src={icon_up}
          alt="Open Sidebar"
          style={{ filter: 'brightness(0) saturate(100%)' }}
        />
      </button>

      {/* Main Content */}
      <Container
        className={`flex flex-coll justify-between mx-auto pt-[5.625rem] pb-2 h-full transition-all duration-300 ${
          siderBarOpen ? 'translate-x-[-150px]' : 'translate-x-0'
        }`}
        // className={`flex flex-coll justify-between mx-auto pt-[5.625rem] pb-2 h-full transition-all duration-300 ${
        //   siderBarOpen ? 'lg:mr-[300px]' : ''
        // }`}
        // className={`flex flex-coll justify-between mx-auto px-4 sm:px-6 lg:px-[5.625rem] pt-[5.625rem] pb-2 h-full transition-all duration-300 ${
        //   siderBarOpen ? 'lg:mr-[300px]' : ''
        // }`}
      >
        <AnimatePresence>
          <ConversationPanel
            conversations={conversations}
            handleChatLog={handleChatLog}
            isMakingSeqQuestions={isMakingSeqQuestions}
            sequenceQuestionsList={sequenceQuestionsList}
            setIsModalVisible={setIsModalVisible}
            streamConversation={streamConversation}
            sidebarState={siderBarOpen}
            setFeedbackDetail={setFeedbackDetail}
            chatRoomNum={selectedChatroom}
          />
        </AnimatePresence>
        <PromptInput
          value={question}
          setValue={setQuestion}
          disclaimer={
            'MAAL Chatbot에서 생성되는 문장은 AI에 의해 임의로 만들어지므로 부정확한 정보가 포함될 수 있으며 회사의 입장을 대변하지 않습니다'
          }
          onSend={handleSendMessage}
          conversations={conversations}
          // setConversations={setConversations}
          sidebarState={siderBarOpen}
          handleNewConversation={handleNewConversation}
          // roomRef={selectedChatroomRef}
          // reconnect={handleNewConversation}
          // setStreamConversation={setStreamConversation}
          // streamConversation={streamConversation}
        />
      </Container>
      {/* Right Sidebar Content */}
      <Sidebar sidebarState={siderBarOpen} handleSideBar={editChat} logData={logData} />

      <div className="fixed z-10">
        <TextModal isShow={isModalVisible} onClose={handleModalClose} onSubmit={handleFeedbackApi}></TextModal>
      </div>
    </div>
  );
};
export default PageTemp;
