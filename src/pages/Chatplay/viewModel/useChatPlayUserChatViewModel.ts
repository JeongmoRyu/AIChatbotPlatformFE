import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import useOutsideClick from './useOutsideClick';

import {
  roomInfoStateChatplay as useRoomInfoState,
  ChatPlayChatHistoryState as useChatPlayChatHistoryStore,
} from '@/shared/store/chatplay';

interface ChatPlayUserChatProps {
  index: number;
  chatData: string;
}

const useChatPlayUserChatViewModel = ({ index, chatData }: ChatPlayUserChatProps) => {
  const roomInfo = useRecoilValue(useRoomInfoState);
  const setChatPlayChatHistoryState = useSetRecoilState(useChatPlayChatHistoryStore);
  const [editableText, setEditableText] = useState<string>(chatData);
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useOutsideClick(editorRef, () => {
    if (isEditing) {
      setIsEditing(false);
      updateChatHistory(editableText);
    }
  });

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditableText(newContent);
  };

  const updateChatHistory = (updatedText: string) => {
    setChatPlayChatHistoryState((prev) => {
      return {
        ...prev,
        history: prev.history.map((item, i) => (i === index ? { ...item, content: updatedText } : item)),
      };
    });
  };

  const toggleEditing = () => {
    if (roomInfo.state === 'EDITABLE') return;
    setIsEditing(!isEditing);
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [isEditing]);

  return {
    editorRef,
    isEditing,
    textareaRef,
    editableText,
    handleContentChange,
    toggleEditing,
    roomInfo,
    setChatPlayChatHistoryState,
  };
};

export default useChatPlayUserChatViewModel;
