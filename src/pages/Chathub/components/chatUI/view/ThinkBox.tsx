import React, { useState } from 'react';
import { ChatMessage } from '../../Chat/view/ChatMessage';

const ThinkBox = ({ content }: { content: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const thinkContent = content.match(/<think>(.*?)<\/think>/s)?.[1] || '';

  return (
    <div className="flex mb-4 p-4 bg-gray-800 rounded-md cursor-pointer">
      <div className="w-1 bg-blue-500 mr-4"></div>

      <div className="flex-1">
        <div className="flex text-right items-center" onClick={() => setIsOpen((prev) => !prev)}>
          <span className="text-gray-100 font-bold">[추론 과정 확인하기]</span>
          <span className="text-gray-100 font-bold">{isOpen ? '▲' : '▼'}</span>
        </div>

        {isOpen && (
          <div className="mt-2">
            <ChatMessage text={thinkContent} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ThinkBox;
