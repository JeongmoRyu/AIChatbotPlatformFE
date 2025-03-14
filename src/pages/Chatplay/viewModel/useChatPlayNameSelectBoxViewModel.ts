import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';

import useFetchChatplay from '../hooks/useFetchChatplay';
import useOutsideClick from './useOutsideClick';

import useChatPlayNameSelectViewModel from './useChatPlayNameSelectViewModel';
import { showNotification } from '@/shared/utils/common-helper';

import {
  chatbotDataChatPlay,
  ChatPlayChatHistoryState,
  roomInfoStateChatplay as useRoomInfoState,
  ChatPlayChatHistoryState as useChatPlayChatHistoryStore,
  ChatPlayChatHistoryStreamState as useChatPlayChatHistoryStreamStore,
  ChatPlayChatTimelineState as useChatPlayChatTimelineStore,
  chatPlayTabInfoState,
  isChatLoading,
} from '@/shared/store/chatplay';

interface isSelectOpen {
  selectHide: string;
  selectedBtnState: string;
}

const useChatPlayNameSelectBoxViewModel = ({
  boxClassName,
  error,
  placeholder,
  defaultValue,
  socket,
}: ChatPlayNameSelectBoxProps) => {
  const { t } = useTranslation(['chatplay']);

  const { getChatbotData, deleteChatbot } = useFetchChatplay(); //챗봇 목록 가져오기
  const { handleOnClickChatbot } = useChatPlayNameSelectViewModel();

  const selectboxRef = useRef<HTMLDivElement>(null);
  const selectedBtnRef = useRef<HTMLButtonElement>(null);

  const chatbotList = useRecoilValue(chatbotDataChatPlay);
  const [roomInfoState, setRoomInfoState] = useRecoilState(useRoomInfoState);

  const [selectedchatbotLabel, setSelectedchatbotLabel] = useState<string | undefined>('');
  const [selectedValue, setSelectedValue] = useState<string | number | null | undefined>(null);

  const [isSelectOpen, setIsSelectOpen] = useState<isSelectOpen>({ selectHide: 'select-hide', selectedBtnState: '' });

  const [selectboxClass, setSelectboxClass] = useState<string | undefined>('');

  const [isShowLocalModal, setIsShowLocalModal] = useState<boolean>(false);
  const [deleteChatbotId, setDeleteChatbotId] = useState<number | null>(null);

  const chatPlayChatHistoryState = useRecoilValue(ChatPlayChatHistoryState);
  const resetChatPlayChatHistoryState = useResetRecoilState(useChatPlayChatHistoryStore);
  const resetChatPlayChatTimelineState = useResetRecoilState(useChatPlayChatTimelineStore);
  const resetChatPlayChatHistoryStreamState = useResetRecoilState(useChatPlayChatHistoryStreamStore);
  const resetTabInfoState = useResetRecoilState(chatPlayTabInfoState);
  const setIsLoading = useSetRecoilState<boolean>(isChatLoading);

  useOutsideClick(selectboxRef, () => {
    setIsSelectOpen({ selectHide: 'select-hide', selectedBtnState: '' });
    setSelectboxClass(boxClassName);
  });

  const handleSelectList = () => {
    if (isSelectOpen.selectHide === 'select-hide') {
      setIsSelectOpen({ selectHide: '', selectedBtnState: 'txt-default select-arrow-active' });
      setSelectboxClass(`${boxClassName} select-active`);
    } else if (!isSelectOpen) {
      setIsSelectOpen({ selectHide: 'select-hide', selectedBtnState: '' });
      setSelectboxClass(boxClassName);
    }
  };

  const handleOnChangeSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    const currentLabel = e.currentTarget.dataset.label;

    const text = e.currentTarget.innerText;
    const secondWord = text.split('\n')[1];

    const selecterID = chatbotList.find((item) => item.name === secondWord)?.chatbot_id;

    if (currentLabel === '생성하기' || currentLabel === 'Create') {
      setRoomInfoState({
        ...roomInfoState,
        checkId: 'create_option',
      });
    } else if (chatPlayChatHistoryState.history.length > 0 && Number(selectedValue) === selecterID) {
      socket && socket.disconnect();
      setIsLoading(false);
      resetChatPlayChatHistoryState();
      resetChatPlayChatTimelineState();
      resetChatPlayChatHistoryStreamState();
      resetTabInfoState();
    } else {
      handleOnClickChatbot && handleOnClickChatbot(e);
    }
    setSelectedchatbotLabel(currentLabel);

    setIsSelectOpen({ selectHide: 'select-hide', selectedBtnState: '' });
    setSelectedValue(e.currentTarget.dataset.value || '');
  };

  useEffect(() => {
    if (chatbotList.length && roomInfoState.checkId === 'create_option') {
      setRoomInfoState({
        ...roomInfoState,
        checkId: chatbotList[chatbotList.length - 1]?.chatbot_id,
      });
      setSelectedValue(chatbotList[chatbotList.length - 1]?.chatbot_id);
    }
  }, [chatbotList]);

  useEffect(() => {
    if (roomInfoState.checkId !== 'create_option' && roomInfoState.checkId) {
      const selectedLabel = chatbotList.find((item) => item.chatbot_id === roomInfoState.checkId)?.name;
      setSelectedchatbotLabel(selectedLabel);
    }
  }, [chatbotList, roomInfoState.checkId]);

  useEffect(() => {
    if (placeholder) {
      setSelectedchatbotLabel(placeholder);
    }
    if (placeholder && !roomInfoState.checkId) {
      setSelectedchatbotLabel(placeholder);
    }
    if (boxClassName) {
      setSelectboxClass(boxClassName);
    }
    if (defaultValue) {
      setSelectedValue(defaultValue);
    }
  }, []);

  useEffect(() => {
    if (error) {
      console.log(error);
      selectedBtnRef.current?.focus();
      setSelectboxClass(`${boxClassName} select-active !rounded`);
    }
  }, []);

  const handleDeleteChatbot = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!deleteChatbotId) return;
    try {
      const success = await deleteChatbot(deleteChatbotId);
      if (success) {
        // 성공 시 UI 상태 업데이트

        if (chatbotList.length === 1) {
          setRoomInfoState({
            ...roomInfoState,
            checkId: '',
          });
          setSelectedchatbotLabel('');
          setSelectedValue(null);
        }
      }
    } catch (error) {
      showNotification(t('chatplay:챗봇_삭제에_실패했습니다'), 'error');
      console.error('UI handling error during chatbot deletion:', error);
    }
  };

  const handleDeleteModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDeleteChatbotId(Number(e.currentTarget.dataset.value));
    setIsShowLocalModal(true);
  };

  const closeModal = () => {
    setIsShowLocalModal(false);
  };

  return {
    selectedValue,
    chatbotList,
    selectedBtnRef,
    handleSelectList,
    selectedchatbotLabel,
    isSelectOpen,
    handleOnChangeSelect,
    handleDeleteModal,
    isShowLocalModal,
    handleDeleteChatbot,
    selectboxClass,
    selectboxRef,
    closeModal,
  };
};

export default useChatPlayNameSelectBoxViewModel;
