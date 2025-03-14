import { Container } from '@/pages/Home/view/PageHome';
import { AnimatePresence } from 'framer-motion';
import { usePageNewChatUIViewModel } from '../viewModel/usePageNewChatUIViewModel';
// import PromptInput from './partials/PromptInput';

const NewPageChatUI = () => {
  // const {
  //   // llmModelList,
  //   // sampleQuestions,
  //   // selectedModel,
  //   // setSelectedModel,
  //   // question,
  //   // setQuestion,
  //   conversations,
  //   ConversationPanel,
  //   // handleConversations,
  //   // setConversations,
  //   // llmDone,
  //   // handleNewConversation,
  //   // isProcessing,
  // } = usePageNewChatUIViewModel();

  return (
    <Container className="flex flex-coll justify-between mx-auto px-[5.625rem] pt-[5.625rem] pb-8 h-full">
      <AnimatePresence>
        {/* <ConversationPanel
          // llmModelList={llmModelList}
          // selectedModel={selectedModel}
          // setSelectedModel={setSelectedModel}
          // sampleQuestions={sampleQuestions}
          // setQuestion={setQuestion}
          conversations={conversations}
          // llmDone={llmDone}
          // setConversations={setConversations}
          // isProcessing={isProcessing}
        /> */}
      </AnimatePresence>
      {/* <PromptInput
        value={question}
        // setValue={setQuestion}
        disclaimer={
          'maum Chatbot에서 생성되는 문장은 AI에 의해 임의로 만들어지므로 부정확한 정보가 포함될 수 있으며 회사의 입장을 대변하지 않습니다'
        }
        onSend={handleConversations}
        setConversations={setConversations}
        // reconnect={handleNewConversation}
      /> */}
    </Container>
  );
};
export default NewPageChatUI;
