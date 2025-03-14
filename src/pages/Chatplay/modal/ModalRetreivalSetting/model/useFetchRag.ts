import React from 'react';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';

import { useChatPlayAxiosHooks } from '@/pages/Chatplay/hooks/useChatPlayAxiosHooks';
import { showNotification } from '@/shared/utils/common-helper';

import { fetchRetreivalListData, listTotalCount, fetchListData as useFetchListData } from '@/shared/store/page-data';
import {
  gptIsModelSaveLoading,
  gptIsRagModelCreating,
  checkList as retreivlCheckList,
  retrievalCreateRag,
} from '@/shared/store/rag';
import { chatPlayEngineData } from '@/shared/store/chatplay';
import { pageIndex } from '@/shared/store/page-data';

interface getListFileData {
  retriever_id: number;
  setFetchDetailData: React.Dispatch<React.SetStateAction<fetchRetreivalDetailProps[]>>;
  setListCount: React.Dispatch<React.SetStateAction<number>>;
}

interface GetRetrieverCheckParams {
  ragModelName: string;
  setDuplicateCheckMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setCheckDuplicate: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageColor: React.Dispatch<React.SetStateAction<'red' | 'blue' | null>>;
  setRagModelName: React.Dispatch<React.SetStateAction<string>>;
}

interface FormDataSaveRagParams {
  ragModelName: string;
  chunkSize: string | null;
  chunkOverlap: string | null;
  uploadFiles: File[];
  onClose: () => void;
}

interface DeleteParams {
  handleClose: (e?: string) => void;
  // fetchAPIListData: () => void;
}

const useFetchRag = () => {
  const { t } = useTranslation(['rag', 'common']);

  const { sendRequest } = useChatPlayAxiosHooks();

  const setIsRagModelCreating = useSetRecoilState<boolean>(gptIsRagModelCreating);
  const setEnginData = useSetRecoilState(chatPlayEngineData);
  const setTotalCount = useSetRecoilState(listTotalCount);

  const [fetchListData, setFetchListData] = useRecoilState(fetchRetreivalListData);

  const setIsModelSaveLoading = useSetRecoilState<boolean>(gptIsModelSaveLoading);

  const resetFetchListData = useResetRecoilState(useFetchListData);
  const resetTotalCount = useResetRecoilState(listTotalCount);

  const [checkList, setCheckList] = useRecoilState<any>(retreivlCheckList);
  const [, setCurrentPage] = useRecoilState(pageIndex);
  const [, setIsRagModalChanged] = useRecoilState<boolean>(retrievalCreateRag);

  const getListFileData = async ({ retriever_id, setFetchDetailData, setListCount }: getListFileData) => {
    //리트리벌 파일 목록 조회
    try {
      const response = await sendRequest(`/retriever/${retriever_id}/files`, 'GET');

      if (response && response.data.code === 'F000') {
        const data = response.data.data;
        // console.log('fetchAPIListData creating', data);
        setFetchDetailData(data);
        setListCount(data.length);
      }
    } catch (error) {
      console.error(error);
      showNotification(t('common:오류가_발생했습니다'), 'error');
      resetFetchListData();
      resetTotalCount();
    }
  };

  const getRagListData = async (currentPage: number) => {
    const paginationSize = 10;

    try {
      const response = await sendRequest(`/retriever/list-all?page=${currentPage}&limit=${paginationSize}`, 'GET');

      if (response && response.data.code === 'F000') {
        const data = response.data.data;
        // console.log('fetchAPIListData creating', data);
        setFetchListData(data.retriever_list);
        setTotalCount(data.total_elements);
      }
    } catch (error) {
      console.error(error);
      showNotification(t('common:오류가_발생했습니다'), 'error');
      resetFetchListData();
      resetTotalCount();
    }
  };

  const getCheckCreating = async () => {
    //생성 중인 모델이 있는지 확인하는 API
    try {
      const response = await sendRequest('/retriever/check/creating', 'GET');
      if (response && response.data) {
        const data = response.data.data;
        // console.log('check creating', data);
        setIsRagModelCreating(data);
      }
    } catch (error) {
      console.error(error);
      setIsRagModelCreating(false);
      showNotification(t('common:오류가_발생했습니다'), 'error');
    }
  };

  const getRetrieverList = async () => {
    try {
      const response = await sendRequest('/retriever/list', 'GET');
      if (response && response.data) {
        const data = response.data.data;
        const selectType = data.map((item: IRagEngineList) => ({
          label: item.model_name,
          value: item.retriever_id,
        }));
        setEnginData((prev: any) => ({ ...prev, rag: selectType }));
      }
    } catch (error) {
      console.error(error);
      showNotification(t('common:오류가_발생했습니다'), 'error');
    }
  };

  const getRetrieverCheck = async ({
    ragModelName,
    setDuplicateCheckMessage,
    setCheckDuplicate,
    setMessageColor,
    setRagModelName,
  }: GetRetrieverCheckParams) => {
    try {
      const response = await sendRequest(
        '/retriever/check',
        'GET',
        undefined,
        undefined,
        {
          company_id: 'models',
          model_name: ragModelName,
        },
        undefined,
        100000, //1분 40초 타임아웃
      );
      console.log(response);
      if (response.data.code === 'R004') {
        const sanitizeKey = (message: string) => message.replace(/ /g, '_').replace(/\./g, '').trim();

        const messageKey = sanitizeKey(response.data.message);

        const translatedMessage = t(`rag:${messageKey}`);

        setDuplicateCheckMessage(translatedMessage);

        setCheckDuplicate(true);
        setMessageColor('blue');
      } else {
        if (
          response.data.message ===
          `Required request parameter 'company_id' for method parameter type String is not present`
        ) {
          setDuplicateCheckMessage(t(`rag:통합_관리자_페이지에서_계정_등록이_필요하니_고객센터로_문의_부탁_드립니다`));
        } else {
          const sanitizeKey = (message: string) => message.replace(/ /g, '_').replace(/\./g, '').trim();

          const messageKey = sanitizeKey(response.data.message);

          const translatedMessage = t(`rag:${messageKey}`);
          setDuplicateCheckMessage(translatedMessage);
        }
        setRagModelName('');
        setMessageColor('red');
      }
    } catch (error) {
      console.error(error);

      showNotification(t('common:오류가_발생했습니다'), 'error');
    }
  };

  const formDataSaveRag = async ({
    ragModelName,
    chunkSize,
    chunkOverlap,
    uploadFiles,
    onClose,
  }: FormDataSaveRagParams) => {
    if (uploadFiles.length === 0) {
      showNotification(t('rag:파일을_선택해주세요'), 'error');
      return;
    }

    const formData = new FormData();
    formData.append('company_id', 'models');
    formData.append('model_name', ragModelName || '');
    formData.append('chunk_size', chunkSize || '');
    formData.append('chunk_overlap', chunkOverlap || '');

    uploadFiles.forEach((file) => {
      formData.append('files', file);
    });

    setIsModelSaveLoading(true);
    setIsRagModelCreating(true);

    try {
      const response = await sendRequest('/retriever', 'POST', { 'Content-Type': 'multipart/form-data' }, formData);
      if (response && response.data.code === 'F000') {
        console.log(response);
        showNotification(t('rag:파일이_업로드되었습니다_임베딩을_기다려_주세요'), 'success');
        getRagListData(1);
        onClose();
      } else {
        showNotification(t('common:오류가_발생했습니다'), 'error');

        setIsModelSaveLoading(false);
      }
    } catch (error) {
      console.error(error);
      showNotification(t('rag:파일_업로드_중_오류가_발생했습니다'), 'error');
      setIsRagModelCreating(false);
      setIsModelSaveLoading(false);
    } finally {
      // setIsModelSaveLoading(false);
      // setIsRagModelCreating(!isRagModalCreating);
      // onClose()
    }
  };

  const deleteRag = async ({ handleClose }: DeleteParams) => {
    try {
      const response = await sendRequest('/retriever', 'DELETE', {}, checkList);

      if (response && response.data.code === 'F000') {
        handleClose();
      }

      if (response && response.data.code === 'R021') {
        handleClose(response.data.message);
      }

      if (response && response.data.code === 'R022') {
        handleClose(response.data.message);
      }

      getRagListData(1);
      setCheckList([]);
      setCurrentPage(1);
      setIsRagModalChanged(true);
      getRetrieverList();
    } catch (error) {
      console.error(error);
      setIsRagModalChanged(false);
      showNotification(t('common:오류가_발생했습니다'), 'error');

      handleClose();
    }
  };

  return {
    getListFileData,
    getRagListData,
    getCheckCreating,
    getRetrieverList,
    getRetrieverCheck,
    formDataSaveRag,
    deleteRag,
  };
};

export default useFetchRag;
