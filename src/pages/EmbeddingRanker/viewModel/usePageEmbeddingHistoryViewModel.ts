import { useRestfulCustomAxios } from '@/shared/hooks/useRestfulCustomAxios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { listPageCount, pagesList, pageIndex } from '@/shared/store/page-data';
import { showNotification } from '@/shared/utils/common-helper';

const usePageEmbeddingHistoryViewModel = () => {
  const navigate = useNavigate();
  const [isMyHistory, setIsMyHistory] = useState(false);
  const [fileList, setFileList] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  // const [totalHistoryData, setTotalHistoryData] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTimeStampAsc, setIsTimeStampAsc] = useState(true);
  const [pageCount, setPageCount] = useRecoilState(listPageCount);
  const [, setPages] = useRecoilState(pagesList);
  const [currentPage, setCurrentPage] = useRecoilState(pageIndex);
  const itemsPerPage = 10;
  const { sendRequest } = useRestfulCustomAxios();
  const [isFirstPageLoad, setIsFirstPageLoad] = useState(true);
  // const [processingDataList, setProcessingDataList] = useState<HistoryItem[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [EmbeddingFin, setEmbeddingFin] = useState(false);

  // 첫 진입 로직
  useEffect(() => {
    setCurrentPage(1);
    fetchPageData(0, itemsPerPage, isMyHistory, isTimeStampAsc);
  }, []);

  // 오른쪽 데이터 로직
  const [settingData, setSettingData] = useState<IRankerData>({
    files: [],
    jsonData: {
      name: '',
      top_k: 5,
      chunking_settings: {
        use_semantic_chunk: false,
        use_fixed_chunk: true,
        fixed_chunk_size: 2100,
        fixed_chunk_overlap: 2000,
        semantic_chunk_bp_type: 'percentile',
        semantic_chunk_embedding: 'text-embedding-ada-002',
      },
      embedding_models: [],
      client_id: '',
    },
    id: 0,
  });

  const getEvaluateData = async (data_id: number) => {
    const response = await sendRequest(`/ranker/evaluate-history/${data_id}`, 'get', undefined, undefined, undefined);
    if (response && response.data) {
      const { data } = response.data;
      const rankerDetail: IRankerDetail = {
        file_path: data.file_path,
        embedding_models: data.embedding_models,
        id: data.id,
        name: data.name,
        use_semantic_chunk: data.use_semantic_chunk,
        use_fixed_chunk: data.use_fixed_chunk,
        fixed_chunk_size: data.fixed_chunk_size,
        fixed_chunk_overlap: data.fixed_chunk_overlap,
        semantic_chunk_bp_type: data.semantic_chunk_bp_type,
        semantic_chunk_embedding: data.semantic_chunk_embedding,
        top_k: data.top_k,
      };
      setFileList(rankerDetail.file_path);
      setSettingData({
        files: [],
        jsonData: {
          name: rankerDetail.name,
          top_k: rankerDetail.top_k,
          chunking_settings: {
            use_semantic_chunk: rankerDetail.use_semantic_chunk,
            use_fixed_chunk: rankerDetail.use_fixed_chunk,
            fixed_chunk_size: rankerDetail.fixed_chunk_size,
            fixed_chunk_overlap: rankerDetail.fixed_chunk_overlap,
            semantic_chunk_bp_type: rankerDetail.semantic_chunk_bp_type,
            semantic_chunk_embedding: rankerDetail.semantic_chunk_embedding,
          },
          embedding_models: rankerDetail.embedding_models,
          client_id: '',
        },
        id: rankerDetail.id,
      });
    } else {
      showNotification('서버로부터 정상적인 데이터를 받지 못했습니다.', 'error');
      return;
    }
  };
  // const handleChangeSetting = (type: string, key: string, value: any) => {
  //   return;
  // };

  // 왼쪽 작성자 버튼 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 왼쪽 데이터 로직
  const handleRowClick = (item: any) => {
    if (item.embedding_status === 'P') {
      return;
    }
    getEvaluateData(item.id);
    setEmbeddingFin(true);
    // console.log('*************cliked*************:', item);
  };

  // 페이지네이션 로직
  useEffect(() => {
    const fetchData = async () => {
      setCurrentPage(1);
      await fetchPageData(0, itemsPerPage, isMyHistory, isTimeStampAsc);
    };
    fetchData();
    setPages(Array.from({ length: pageCount }, (_, i) => i + 1));
  }, [pageCount]);

  useEffect(() => {
    if (isFirstPageLoad && historyData.length > 0) {
      const firstItem = historyData[0];
      getEvaluateData(firstItem.id);
      setIsFirstPageLoad(false);
      if (firstItem.embedding_status === 'C') {
        setEmbeddingFin(true);
      } else {
        setEmbeddingFin(false);
      }
    }
  }, [historyData, isFirstPageLoad]);

  useEffect(() => {
    loadHistoryData();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentPage, isMyHistory, isTimeStampAsc]);

  const loadHistoryData = useCallback(async () => {
    try {
      fetchPageData(currentPage - 1, itemsPerPage, isMyHistory, isTimeStampAsc);
      setPages(Array.from({ length: pageCount }, (_, i) => i + 1));
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, isMyHistory, pageCount, isTimeStampAsc]);

  // useEffect(() => {
  //   loadHistoryData();
  // }, [loadHistoryData]);

  const fetchPageData = async (page: number, size: number, isMyHistory: boolean, isTimeStampDesc: boolean) => {
    let direction = 'desc';
    if (!isTimeStampDesc) {
      direction = 'asc';
    }
    const params = {
      page: page,
      size: size,
      is_mine: isMyHistory,
      sort_field: 'createdAt',
      sort_direction: direction,
    };
    const response = await sendRequest('/ranker/evaluate-history', 'get', undefined, undefined, params);
    if (response && response.data) {
      const { data } = response.data;
      setPageCount(data.total_pages);
      const tempData = data.content.map((item: HistoryItem) => {
        return {
          row_number: item.row_number,
          id: item.id,
          name: item.name,
          time_stamp: item.time_stamp,
          creator: item.creator,
          embedding_status: item.embedding_status,
          user_key: item.user_key,
          is_mine: item.is_mine,
        };
      });
      setHistoryData(tempData);
    } else {
      showNotification('서버로부터 정상적인 데이터를 받지 못했습니다.', 'error');
      return;
    }
  };

  // 진행 중인 데이터 확인 로직
  // useEffect(() => {
  //   const updateProcessingData = async () => {
  //     const embeddingPData = historyData.filter(item => item.embedding_status === 'P');
  //     setProcessingDataList(embeddingPData);
  //   };
  //   updateProcessingData();
  // }, [historyData]);

  // useEffect(() => {
  //   if (processingDataList.length === 0) {
  //     return;
  //   } else {
  //     timerRef.current = setInterval(embeddingRefreshCheck, 5000);
  //     console.log('Processing data list:', processingDataList);
  //     console.log('Current page:', currentPage);
  //   }
  //   return () => {
  //     if (timerRef.current) {
  //       clearInterval(timerRef.current);
  //     }
  //   };
  // }, [processingDataList]);

  // const trackPagesForProcessingData = () => {
  //   const pagesToCheck = new Set<number>();
  //   processingDataList.forEach(item => {
  //     const index = historyData.findIndex(Item => Item.id === item.id);
  //     if (index !== -1) {
  //       const page = Math.floor(index / itemsPerPage);
  //       pagesToCheck.add(page);
  //     }
  //   });
  //   return Array.from(pagesToCheck);
  // };

  // const embeddingRefreshCheck = async () => {
  //   const pagesToCheck = trackPagesForProcessingData();
  //   for (const page of pagesToCheck) {
  //     await fetchPageData(page, itemsPerPage, false, isMyHistory, isTimeStampAsc);
  //   }
  //   const updatedProcessingDataList = processingDataList.map(item => {
  //     const updatedItem = totalHistoryData.find(totalItem => totalItem.id === item.id);
  //     if (updatedItem && updatedItem.embedding_status !== 'P') {
  //       fetchPageData(0, pageCount, true, isMyHistory, isTimeStampAsc);
  //       return updatedItem;
  //     }
  //     return item;
  //   });
  //   setProcessingDataList(updatedProcessingDataList);
  // };

  // 오른쪽 delete modal
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleRankerDetailDeleteAPI = async () => {
    const index = settingData.id;
    console.log(index);
    if (!index) {
      return false;
    }
    const response = await sendRequest(`/ranker/evaluate-history/${index}`, 'delete', undefined);
    if (response && response.data) {
      if (response.data.code === 'EA01') {
        showNotification('삭제 권한이 없습니다.', 'error');
        setIsModalVisible(false);
        return false;
      }
      if (response.data.code !== 'F002' && response.data.result !== false) {
        showNotification('정상적으로 삭제되었습니다.', 'success');
        return true;
      } else {
        showNotification('정상적으로 챗봇을 삭제하지 못하였습니다.', 'error');
        return false;
      }
    } else {
      showNotification('정상적으로 챗봇을 삭제하지 못하였습니다.', 'error');
      return false;
    }
  };

  const handleModalCheck = async () => {
    const deleteSuccess = await handleRankerDetailDeleteAPI();

    if (deleteSuccess) {
      setIsModalVisible(false);
      setTimeout(() => {
        // setTotalHistoryData(prevTotalHistoryData =>
        //   prevTotalHistoryData.filter(item => item.id !== settingData.id)
        // );
        setCurrentPage(1);
        setIsFirstPageLoad(true);
        fetchPageData(0, pageCount, isMyHistory, isTimeStampAsc);
      }, 1000);
    }
  };
  return {
    navigate,
    setIsTimeStampAsc,
    setCurrentPage,
    isTimeStampAsc,
    dropdownRef,
    isDropdownOpen,
    setIsDropdownOpen,
    isMyHistory,
    setIsMyHistory,
    isLoading,
    historyData,
    handleRowClick,
    settingData,
    fileList,
    setIsModalVisible,
    isModalVisible,
    handleModalClose,
    handleModalCheck,
    EmbeddingFin,
  };
};
export default usePageEmbeddingHistoryViewModel;
