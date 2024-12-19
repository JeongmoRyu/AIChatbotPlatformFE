import { useEffect, useState } from 'react';
// import { EMBEDDING_HISTORY } from 'data/routers';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { listPageCount, pagesList, pageIndex } from '@/shared/store/page-data';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { showNotification } from '@/shared/utils/common-helper';
import { useRestfulCustomAxios } from '@/shared/hooks/useRestfulCustomAxios';
import { TABS, qaWorksheetColumns, rankingWorksheetColumns } from '../model/usePageEmbeddingLeaderBoardModel';

const usePageEmbeddingLeaderBoardVM = () => {
  const navigate = useNavigate();
  const [tabActive, setTabActive] = useState('QaData');
  const [modalRect, setModalRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [selectedTdId, setSelectedTdId] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const location = useLocation();
  const leaderboardId = location.state?.id !== undefined ? location.state.id : null;
  const leaderboardTopK = location.state?.topK !== undefined ? location.state.topK : 5;
  // console.log(leaderboardId, leaderboardTopK)
  const { sendRequest } = useRestfulCustomAxios();
  const [qaDisPlayData, setQaDisPlayData] = useState<QADetailData[]>([]);
  const [qaTotalData, setQaTotalData] = useState<QADetailData[]>([]);
  const [rankingDisPlayData, setRankingDisPlayData] = useState<RankingDetailData[]>([]);
  const [rankingTotalData, setRankingTotalData] = useState<RankingData[]>([]);
  const [qaTotalPage, setQaTotalPage] = useState<number>(0);
  const [rankingTotalPage, setRankingTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useRecoilState(pageIndex);
  const [pageCount, setPageCount] = useRecoilState(listPageCount);
  const resetPageCount = useResetRecoilState(listPageCount);
  const setPages = useSetRecoilState(pagesList);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const tabClick = (e: React.MouseEvent<HTMLAnchorElement>, tabId: string) => {
    e.preventDefault();
    setTabActive(tabId);
    setCurrentPage(1);
  };

  const handleModalClick = (e: any, id: any, text: any) => {
    const tdRect = e.target.getBoundingClientRect();
    if (selectedTdId === id) {
      setModalRect({
        x: tdRect.left + window.scrollX,
        y: tdRect.top + window.scrollY,
        w: tdRect.width + 15,
        h: tdRect.height + 15,
      });
      setSelectedText(text);
    } else {
      setSelectedTdId(id);
    }
  };
  const handleModalClose = (event: any) => {
    if (event.target === event.currentTarget) {
      setModalRect({ x: 0, y: 0, w: 0, h: 0 });
      setSelectedText('');
      setSelectedTdId(null); // 모달 닫힘과 동시에 선택 초기화
    }
  };

  // Pagination 추가

  useEffect(() => {
    setCurrentPage(1);
    const fetchInitialData = async () => {
      setIsLoading(true);
      const { totalPages: qaPages } = await getQAData(leaderboardId, 0);
      const { totalPages: rankingPages } = await getRankingData(leaderboardId, 0);

      setQaTotalPage(qaPages);
      setRankingTotalPage(rankingPages);
      setIsLoading(false);
      fetchAllQAData(leaderboardId, qaPages);
      fetchAllRankingData(leaderboardId, rankingPages);
    };
    fetchInitialData();
  }, [leaderboardId]);

  useEffect(() => {
    const fetchDataForCurrentPage = async () => {
      setIsLoading(true);
      if (tabActive === 'QaData') {
        const { content } = await getQAData(leaderboardId, currentPage - 1);
        setQaDisPlayData(content);
      } else {
        const { content } = await getRankingData(leaderboardId, currentPage - 1);
        setRankingDisPlayData(content);
      }
      setIsLoading(false);
    };
    fetchDataForCurrentPage();
  }, [currentPage, tabActive, leaderboardId]);

  const handleNavigateToHistory = () => {
    resetPageCount();
    setShouldNavigate(true); // 상태 변경 후 이동 플래그 설정
  };

  useEffect(() => {
    if (shouldNavigate && pageCount === 1) {
      navigate('/embedding-history');
    }
  }, [shouldNavigate, pageCount, navigate]);

  const getQAData = async (data_id: number, page: number) => {
    const params = { page, size: itemsPerPage };
    const response = await sendRequest(`/ranker/evaluate-history/qa/${data_id}`, 'get', undefined, undefined, params);
    if (response && response.data) {
      const { data } = response.data;
      if (page === 0) {
        console.log(`QA Total Pages: ${data.total_pages}`);
      }
      return { totalPages: data.total_pages, content: data.content };
    } else {
      showNotification('서버로부터 정상적인 데이터를 받지 못했습니다.', 'error');
      return { totalPages: 0, content: [] };
    }
  };

  const getRankingData = async (data_id: number, page: number) => {
    const params = { page, size: itemsPerPage };
    const response = await sendRequest(
      `/ranker/evaluate-history/ranking/${data_id}`,
      'get',
      undefined,
      undefined,
      params,
    );
    if (response && response.data) {
      const { data } = response.data;
      if (page === 0) {
        console.log(`Ranking Total Pages: ${data.total_pages}`);
      }
      return { totalPages: data.total_pages, content: data.content };
    } else {
      showNotification('서버로부터 정상적인 데이터를 받지 못했습니다.', 'error');
      return { totalPages: 0, content: [] };
    }
  };

  useEffect(() => {
    const totalPages = tabActive === 'QaData' ? qaTotalPage : rankingTotalPage;
    setPageCount(totalPages);
    setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
  }, [tabActive, qaTotalPage, rankingTotalPage, setPageCount, setPages]);

  // 탭별 데이터 상태
  const dataToDisplay = tabActive === 'QaData' ? qaDisPlayData : rankingDisPlayData;

  const fetchAllQAData = async (data_id: number, totalPages: number) => {
    let allData: QADetailData[] = [];
    for (let page = 0; page < totalPages; page++) {
      const { content } = await getQAData(data_id, page);
      allData = [...allData, ...content];
    }
    setQaTotalData(allData);
  };

  const fetchAllRankingData = async (data_id: number, totalPages: number) => {
    let allData: RankingData[] = [];
    for (let page = 0; page < totalPages; page++) {
      const { content } = await getRankingData(data_id, page);
      allData = [...allData, ...content];
    }
    setRankingTotalData(allData);
  };

  // excel로 파일 전환
  const exportToExcel = async () => {
    const workbook = new Workbook();

    const qaWorksheet = workbook.addWorksheet('QA Data');
    qaWorksheet.columns = qaWorksheetColumns;
    qaTotalData.forEach((data) => {
      qaWorksheet.addRow(data);
    });

    const rankingWorksheet = workbook.addWorksheet('Ranking Data');
    rankingWorksheet.columns = rankingWorksheetColumns;
    rankingTotalData.forEach((data) => {
      rankingWorksheet.addRow(data);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'EmbeddingData.xlsx');
  };

  return {
    exportToExcel,
    handleModalClick,
    handleModalClose,
    handleNavigateToHistory,
    TABS,
    tabActive,
    tabClick,
    dataToDisplay,
    isLoading,
    leaderboardTopK,
    selectedText,
    modalRect,
  };
};
export default usePageEmbeddingLeaderBoardVM;
