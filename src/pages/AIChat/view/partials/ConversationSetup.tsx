// ======================================
// Imports
// ======================================
import { motion } from 'framer-motion';
import { ChangeEvent, Dispatch, memo, SetStateAction, useState } from 'react';
import tw from 'tailwind-styled-components';

import WidgetSelector from '@/widgets/selector/views/WidgetSelector';

import RenderQuestions from './RenderQuestions';

// ======================================
// ConversationSetup Component
// ======================================
const ConversationSetup = ({
  llmModelList,
  selectedModel,
  setSelectedModel,
  sampleQuestions,
  setQuestion,
}: {
  llmModelList: { id: string; name: string; isActive?: boolean }[];
  selectedModel: string;
  setSelectedModel: Dispatch<SetStateAction<string>>;
  sampleQuestions: ISampleQuestionGroup[];
  setQuestion: (e: ChangeEvent<HTMLTextAreaElement> | string) => void;
}) => {
  const [showSamples, setShowSamples] = useState(false);

  return (
    <UIConversationSetup>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={() => setShowSamples(true)}
      >
        <WidgetSelector list={llmModelList} value={selectedModel} setValue={setSelectedModel} />
      </motion.div>

      <RenderQuestions questionGroups={sampleQuestions} setQuestion={setQuestion} showSamples={showSamples} />
    </UIConversationSetup>
  );
};

export default memo(ConversationSetup);

// ======================================
// Styled Components
// ======================================
const UIConversationSetup = tw.div`
  flex
  flex-col
  max-w-[50rem]
  w-full
  gap-[3.125rem]
  mb-80
`;
