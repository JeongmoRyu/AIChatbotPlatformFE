import { useCallback, useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';

import {
  ChatPlayChatHistoryState as useChatPlayChatHistoryStore,
  roomInfoStateChatplay as useRoomInfoState,
} from '@/shared/store/chatplay';
import { showNotification } from '@/shared/utils/common-helper';

import useOutsideClick from '../viewModel/useOutsideClick';

const components = {
  h1: ({ ...props }) => <h1 className="mt-2 mb-4 text-2xl font-bold" {...props} />,
  h2: ({ ...props }) => <h2 className="mt-2 mb-2 text-xl font-bold" {...props} />,
  h3: ({ ...props }) => <h3 className="mt-2 mb-2 text-lg font-bold" {...props} />,
  h4: ({ ...props }) => <h4 className="mt-2 mb-2 font-bold text-md" {...props} />,
  h5: ({ ...props }) => <h5 className="mt-2 mb-2 text-sm font-bold" {...props} />,
  h6: ({ ...props }) => <h6 className="mt-2 mb-2 text-xs font-bold" {...props} />,
  table: ({ ...props }) => <table className="w-full border border-collapse border-black" {...props} />,
  th: ({ ...props }) => <th className="px-3 py-2 font-bold text-black bg-yellow-300 border border-black" {...props} />,
  td: ({ ...props }) => <td className="px-3 py-2 border border-black" {...props} />,
  li: ({ ...props }) => <li className="ml-8" {...props} />,
};

interface MDChatMessageProps {
  index: number;
  text: string;
}

const MDChatMessage = ({ index, text }: MDChatMessageProps) => {
  const { t } = useTranslation(['llm']);

  const roomInfo = useRecoilValue(useRoomInfoState);
  const [textValue, setTextValue] = useState(text);
  const [isEditable, setIsEditable] = useState(false);
  const editorRef = useRef(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const setChatPlayChatHistoryState = useSetRecoilState(useChatPlayChatHistoryStore);

  const fallbackCopyToClipboard = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showNotification(t('llm:내용이_클립보드에_복사되었습니다'), 'success');
    } catch (err) {
      console.error(t('llm:클립보드_복사에_실패했습니다'), err);
      showNotification(t('llm:복사할_내용이_없습니다'), 'error');
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const handleCopy = useCallback(async (text: string) => {
    if (!text) {
      showNotification(t('llm:복사할_내용이_없습니다'), 'error');
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        showNotification(t('llm:내용이_클립보드에_복사되었습니다'), 'success');
      } catch (err) {
        console.error(t('llm:클립보드_복사에_실패했습니다'), err);
        showNotification(t('llm:복사할_내용이_없습니다'), 'error');
      }
    } else {
      console.warn('Using fallback for clipboard copy.');
      fallbackCopyToClipboard(text);
    }
  }, []);

  const renderMarkdown = (markdownLines: string[]) => (
    <div key={`text-${markdownLines.join('\n')}`} className="relative mb-2 markdown-body">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {markdownLines.join('\n').replace(/null\[DONE\]/g, '')}
      </Markdown>
    </div>
  );

  const renderCodeBlock = (codeBlock: string[]) => (
    <div key={`code-${codeBlock.join('\n')}`} className="my-4 rounded-md">
      <div
        className="flex justify-between px-3 py-2 font-bold text-white bg-black"
        style={{ borderRadius: '10px 10px 0 0' }}
      >
        <div>{codeBlock[0].toUpperCase()}</div>
        <div className="flex items-center cursor-pointer" onClick={() => handleCopy(codeBlock.slice(1).join('\n'))}>
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 mr-1"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
          <button>Copy code</button>
        </div>
      </div>
      <SyntaxHighlighter
        language={codeBlock[0]}
        style={dracula}
        wrapLongLines={true}
        customStyle={{ margin: 0, borderRadius: '0 0 10px 10px' }}
      >
        {codeBlock.slice(1).join('\n')}
      </SyntaxHighlighter>
    </div>
  );

  if (!text) return <div className="relative w-full">{JSON.stringify(text)}</div>;

  const elements: JSX.Element[] = [];
  const lines = textValue.split('\n');
  let isCodeBlock = false;
  let codeBlock: string[] = [];
  let markdownLines: string[] = [];

  lines.forEach((line) => {
    if (line.startsWith('```')) {
      if (isCodeBlock) {
        elements.push(renderCodeBlock(codeBlock));
        codeBlock = [];
        isCodeBlock = false;
      } else {
        if (markdownLines.length > 0) {
          elements.push(renderMarkdown(markdownLines));
          markdownLines = [];
        }
        isCodeBlock = true;
        codeBlock.push(line.substring(3));
      }
    } else {
      isCodeBlock ? codeBlock.push(line) : markdownLines.push(line);
    }
  });

  if (markdownLines.length > 0) elements.push(renderMarkdown(markdownLines));

  useOutsideClick(editorRef, () => {
    if (isEditable) {
      setIsEditable(false);
      updateChatHistory(textValue);
    }
  });

  const updateChatHistory = (updatedText: string) => {
    setChatPlayChatHistoryState((prev) => {
      return {
        ...prev,
        history: prev.history.map((item, i) => (i === index ? { ...item, content: updatedText } : item)),
      };
    });
  };

  const toggleEdit = () => {
    if (roomInfo.state === 'EDITABLE') {
      setIsEditable(!isEditable);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [isEditable]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setTextValue(newContent);
    adjustTextareaHeight();
  };

  return (
    <div className="relative w-full" onClick={toggleEdit} ref={editorRef}>
      {isEditable ? (
        <textarea
          ref={textareaRef}
          value={textValue}
          onClick={(e) => e.stopPropagation()}
          onChange={handleContentChange}
          className="w-full h-auto p-2 border-none resize-none focus:ring-0 focus:outline-none"
        />
      ) : (
        elements
      )}
    </div>
  );
};

export default MDChatMessage;
