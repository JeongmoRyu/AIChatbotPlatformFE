import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { modalNoticeState as useModalNoticeStore } from '@/shared/store/modal';
import { checkList as retreivlCheckList } from '@/shared/store/rag';

import useFetchRag from '../../ModalRetreivalSetting/model/useFetchRag';

interface ModalNoticeProps {
  handleClose: () => void;
}

const ModalConfirmDeleteViewModel = ({ handleClose }: ModalNoticeProps) => {
  const [modalNoticeState] = useRecoilState(useModalNoticeStore);

  const { deleteRag } = useFetchRag();

  const checkList = useRecoilValue<any>(retreivlCheckList);

  const handleDeleteModal = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    await deleteRag({ handleClose });
  };

  return { checkList, modalNoticeState, handleDeleteModal };
};

export default ModalConfirmDeleteViewModel;
