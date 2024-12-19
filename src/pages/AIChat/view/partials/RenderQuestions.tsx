import { ChangeEvent, ReactNode, useMemo, useRef } from 'react';
import tw from 'tailwind-styled-components';

import { cn } from '@/shared/utils/cn';

import BlockQuestionSample from './BlockQuestionSample';

const RenderQuestions = ({
  questionGroups,
  setQuestion,
  showSamples,
}: {
  questionGroups: ISampleQuestionGroup[];
  setQuestion: (e: ChangeEvent<HTMLTextAreaElement> | string) => void;
  showSamples: boolean;
}) => {
  const delayCalcRef = useRef<number>(0);
  return (
    showSamples && (
      <UISampleQuestions>
        {questionGroups.map((group, index) =>
          group.type === 'multi' ? (
            <MultiStage count={group.count!} key={index}>
              {group.questions.map((q) => {
                const delay = delayCalcRef.current;
                delayCalcRef.current += 0.2;
                return <BlockQuestionSample key={getUUID()} {...q} setQuestion={setQuestion} delay={delay} />;
              })}
            </MultiStage>
          ) : (
            group.questions.map((q) => {
              const delay = delayCalcRef.current;
              delayCalcRef.current += 0.2;
              return <BlockQuestionSample key={getUUID()} {...q} setQuestion={setQuestion} delay={delay} />;
            })
          ),
        )}
      </UISampleQuestions>
    )
  );
};

export default RenderQuestions;

const getUUID = () => {
  return Math.random().toString(36).substring(2);
};

const UISampleQuestions = tw.div`
  flex
  flex-col
  gap-5
`;

const MultiStage = ({ count, children }: { count: number; children: ReactNode | ReactNode[] }) => {
  const gridCols = useMemo(() => `grid-cols-${count}`, [count]);
  return <div className={cn('grid', gridCols, 'gap-5')}>{children}</div>;
};
