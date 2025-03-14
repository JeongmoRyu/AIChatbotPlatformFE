import { memo } from 'react';
// import { ChangeEvent, Dispatch, memo, SetStateAction, useState } from 'react';
import tw from 'tailwind-styled-components';

// import RenderQuestions from './RenderQuestions';

const ChatSetup = ({}: {}) => {
  // const [showSamples, setShowSamples] = useState(false);
  const exampleQuestions = ['예시 질문 1', '예시 질문 2', '예시 질문 3'];

  return (
    <UIChatSetup>
      <Header>테스트 챗봇1</Header>
      {/* 중앙 텍스트 */}
      <MainContent>
        <h1 className="text-xl font-bold text-gray-800 mb-6">무엇을 도와드릴까요?</h1>
      </MainContent>{' '}
      <ExampleQuestions>
        {exampleQuestions.map((question, index) => (
          <button
            key={index}
            className="w-full max-w-[50rem] bg-[#f4f6f8] border border-[#DDDDDD] rounded-md py-2 px-4 text-left hover:bg-gray-200"
          >
            {question}
          </button>
        ))}
      </ExampleQuestions>
    </UIChatSetup>
  );
};

export default memo(ChatSetup);

const UIChatSetup = tw.div`
  flex
  flex-col
  items-center
  justify-center
  w-screen
  h-full
  gap-[3.125rem]
`;

const Header = tw.div`
  text-lg
  font-semibold
  text-gray-800
`;

const MainContent = tw.div`
  flex
  items-center
  justify-center
`;

const ExampleQuestions = tw.div`
  flex
  flex-col
  items-center
  mt-28
  gap-2
  w-full
  max-w-[50rem]
`;
