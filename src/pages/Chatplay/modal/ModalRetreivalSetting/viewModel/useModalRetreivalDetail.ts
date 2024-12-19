import { useRef, useState, useEffect } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';

import useFetchRag from '../model/useFetchRag';

import { userLoginState as useUserLoginStore } from '@/shared/store/onpromise';
import { listTotalCount } from '@/shared/store/page-data';
import { fetchListData as useFetchListData, getListParams as useGetListParams } from '@/shared/store/page-data';
import { isShowModal as useIsShowModal, modalType as useModalType } from '@/shared/store/modal';

interface useModalRetreivalDetailProps {
  retriever_id: number;
  isShow: boolean;
}

const useModalRetreivalDetail = ({ retriever_id, isShow }: useModalRetreivalDetailProps) => {
  const { getListFileData } = useFetchRag();
  const userLoginState = useRecoilValue(useUserLoginStore);

  const [fetchDetailData, setFetchDetailData] = useState<fetchRetreivalDetailProps[]>([]);

  const [listCount, setListCount] = useState<number>(0);

  const refContent = useRef<HTMLDivElement>(null);

  const resetListParams = useResetRecoilState(useGetListParams);
  const resetFetchListData = useResetRecoilState(useFetchListData);
  const resetTotalCount = useResetRecoilState(listTotalCount);
  const resetModalType = useResetRecoilState(useModalType);
  const resetIsShowModal = useResetRecoilState(useIsShowModal);

  useEffect(() => {
    if (isShow) {
      getListFileData({ retriever_id, setFetchDetailData, setListCount });
    }
  }, [isShow]);

  // 초기 검색 조건 세팅
  useEffect(() => {
    return () => {
      resetListParams();
      resetFetchListData();
      resetTotalCount();
      resetModalType();
      resetIsShowModal();
    };
  }, []);

  return { refContent, listCount, fetchDetailData, userLoginState };
};

export default useModalRetreivalDetail;
