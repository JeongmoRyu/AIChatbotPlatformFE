// ======================================
// Imports
// ======================================
import { motion } from 'framer-motion';
import { ChangeEvent, useId } from 'react';
import tw from 'tailwind-styled-components'; // Tailwind-Styled-Components 사용을 위해 추가

// ======================================
// BlockQuestionSample Component
// ======================================
const BlockQuestionSample = ({
  title,
  question,
  setQuestion,
  delay = 0,
}: {
  title: string;
  question: string;
  setQuestion: (e: ChangeEvent<HTMLTextAreaElement> | string) => void;
  delay: number;
}) => {
  const uniqueKey = useId();
  return (
    <UIBlockQuestionSection
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      onClick={() => setQuestion(question)}
    >
      <UIQuestionTitle>{title}</UIQuestionTitle>
      <div>
        {question.split('\n').map((line, index) => (
          <UIQuestion key={`${uniqueKey}-${index}`}>{line.trim()}</UIQuestion>
        ))}
      </div>
    </UIBlockQuestionSection>
  );
};

export default BlockQuestionSample;

// ======================================
// Styled Components
// ======================================
const UIBlockQuestionSection = tw(motion.section)`
  p-5
  rounded-lg
  bg-white
  text-black
  flex
  flex-col
  justify-center
  gap-2.5
  hover:cursor-pointer
  hover:bg-[#EAEAEA]
`;

const UIQuestionTitle = tw.h5`
  font-medium
  text-lg
  text-[#7B8188]
`;

const UIQuestion = tw.div`
  text-sm
  text-black
  break-words
`;
