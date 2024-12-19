import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Container } from '@/pages/Home/view/PageHome';

import { usePageAIChatViewModel } from '../viewModels/usePageAIChatViewModel';
import QuestionInput from './partials/QuestionInput';

const PageAIChat = () => {
  const { t } = useTranslation(['aiChat']);

  const {
    llmModelList,
    sampleQuestions,
    selectedModel,
    setSelectedModel,
    question,
    setQuestion,
    conversations,
    ConversationPanel,
    handleConversations,
    setConversations,
    llmDone,
    handleNewConversation,
    isProcessing,
  } = usePageAIChatViewModel();

  useEffect(() => {
    console.log('PageAIChat mounted', isProcessing);
    return () => {
      console.log('PageAIChat unmounted');
    };
  }, [isProcessing]);

  return (
    <Container className="flex flex-coll justify-between mx-auto px-[5.625rem] pt-[5.625rem] pb-8 h-full">
      <AnimatePresence>
        <ConversationPanel
          llmModelList={llmModelList}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          sampleQuestions={sampleQuestions}
          setQuestion={setQuestion}
          conversations={conversations}
          llmDone={llmDone}
          setConversations={setConversations}
          isProcessing={isProcessing}
        />
      </AnimatePresence>
      <QuestionInput
        value={question}
        setValue={setQuestion}
        disclaimer={t(
          'aiChat:maum_Chat_bot에서_생성되는_문장은_AI에_의해_임의로_만들어지므로_부정확한_정보가_포함될_수_있으며_회사의_입장을_대변하지_않습니다',
        )}
        onSend={handleConversations}
        setConversations={setConversations}
        reconnect={handleNewConversation}
      />
    </Container>
  );
};

export default PageAIChat;
