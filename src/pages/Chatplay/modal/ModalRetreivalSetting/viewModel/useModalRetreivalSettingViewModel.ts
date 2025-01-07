import React, { useRef, useState, useEffect } from 'react';

import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';

import { designListParams, gptIsRagModelCreating, retrievalCreateRag } from '@/shared/store/rag';
import { userLoginState as useUserLoginStore } from '@/shared/store/onpromise';
import { isShowModal as useIsShowModal, modalType as useModalType } from '@/shared/store/modal';
import {
  fetchRetreivalListData,
  listPageCount,
  listTotalCount,
  pageIndex,
  pagesList,
  fetchListData as useFetchListData,
  getListParams as useGetListParams,
} from '@/shared/store/page-data';
import useFetchRag from '../model/useFetchRag';

interface isShowModal {
  isShow: boolean;
  name: string;
}

const useModalRetreivalSettingViewModel = () => {
  const { getRagListData, getCheckCreating } = useFetchRag();
  const userLoginState = useRecoilValue(useUserLoginStore);

  const [currentPage, setCurrentPage] = useRecoilState(pageIndex);
  const [, setPageCount] = useRecoilState(listPageCount);
  const [, setPages] = useRecoilState(pagesList);
  const [getListParams, setListParams] = useRecoilState(designListParams);

  const fetchListData = useRecoilValue(fetchRetreivalListData);
  const totalCount = useRecoilValue(listTotalCount);
  const isRagModelCreating = useRecoilValue(gptIsRagModelCreating);
  const isRagModalChanged = useRecoilValue(retrievalCreateRag);

  const [isShowBackdrop, setIsShowBackdrop] = useState<boolean>(false);
  const [isShowModal, setIsShowModal] = useState<isShowModal>({
    isShow: false,
    name: '',
  });

  const refContent = useRef<HTMLDivElement>(null);

  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const resetListParams = useResetRecoilState(useGetListParams);
  const resetFetchListData = useResetRecoilState(useFetchListData);
  const resetTotalCount = useResetRecoilState(listTotalCount);
  const resetModalType = useResetRecoilState(useModalType);
  const resetIsShowModal = useResetRecoilState(useIsShowModal);
  const resetCurrentPage = useResetRecoilState(pageIndex);

  const { limit = 10 } = getListParams;

  // 초기 목록 불러오기
  useEffect(() => {
    console.log('isRagModelCreating', isRagModelCreating);
    console.log('currentPage', currentPage);
    if (!isRagModelCreating) {
      getRagListData(currentPage);
    }
  }, [isRagModelCreating, isRagModalChanged]);

  // 초기 검색 조건 세팅
  useEffect(() => {
    setCurrentPage(1);
    return () => {
      resetListParams();
      resetFetchListData();
      resetTotalCount();
      resetModalType();
      resetIsShowModal();
    };
  }, []);

  // 페이징 조건 세팅
  useEffect(() => {
    const tmpCnt = Math.ceil(totalCount / limit);
    setPageCount(tmpCnt);
    setPages(Array.from({ length: tmpCnt }, (_, i) => i + 1) as any);
  }, [totalCount, limit]);

  useEffect(() => {
    setListParams((prevState) => ({
      ...prevState,
      start: (currentPage - 1) * 10,
      limit: 10,
    }));

    getRagListData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    console.log('currentPage', currentPage);
  }, [currentPage]);

  const handleRegisterModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsShowBackdrop(true);

    setIsShowModal({ isShow: true, name: 'register' });
    getCheckCreating();
  };

  const closeModal = () => {
    setIsShowBackdrop(false);
    resetCurrentPage();
    setIsShowModal({ isShow: false, name: 'register' });
  };

  const handleDeleteModal = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsShowBackdrop(true);

    setIsShowModal({ isShow: true, name: 'delete' });
  };

  return {
    isRagModelCreating,
    refContent,
    deleteButtonRef,
    handleDeleteModal,
    totalCount,
    fetchListData,
    userLoginState,
    isShowModal,
    closeModal,
    isShowBackdrop,
    handleRegisterModal,

    modalRef,
  };
};

export default useModalRetreivalSettingViewModel;
