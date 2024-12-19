import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import useFetchChatplay from '../hooks/useFetchChatplay';
import useOutsideClick from './useOutsideClick';

import useChatPlayNameSelectViewModel from './useChatPlayNameSelectViewModel';
import { showNotification } from '@/shared/utils/common-helper';

import { chatbotDataChatPlay, roomInfoStateChatplay as useRoomInfoState } from '@/shared/store/chatplay';

interface isSelectOpen {
  selectHide: string;
  selectedBtnState: string;
}

const useChatPlayNameSelectBoxViewModel = ({
  boxClassName,
  error,
  placeholder,
  defaultValue,
}: ChatPlayNameSelectBoxProps) => {
  const { getChatbotData, deleteChatbot } = useFetchChatplay(); //쳇봇 목록 가져오기
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

    if (currentLabel === '생성하기') {
      setRoomInfoState({
        ...roomInfoState,
        checkId: 'create_option',
      });
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
        showNotification('챗봇이 삭제되었습니다.', 'success');
        getChatbotData && getChatbotData();

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
      showNotification('챗봇 삭제에 실패했습니다.', 'error');
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
