import { useState, useEffect } from 'react';

import { useRecoilState, useRecoilValue } from 'recoil';
import { listPageCount, pagesList, pageIndex, getListParams as useGetListParams } from '@/shared/store/page-data';

const usePaginationViewModel = () => {
  const [pageGroup, setPageGroup] = useState([]);

  const [getListParams, setListParams] = useRecoilState(useGetListParams);
  const [currentPage, setCurrentPage] = useRecoilState(pageIndex);

  const pageCount = useRecoilValue(listPageCount);
  const pages = useRecoilValue(pagesList);

  // 5개 페이징 버튼 그룹 생성
  const makePageInfo = (pages: any) => {
    const pageArr: number[] = [];
    const pagination: any = () => {
      for (let i = 0; i < pages.length; i += 5) {
        pageArr.push(pages.slice(i, i + 5));
      }
      return pageArr;
    };

    const currentGroup = pagination(pageArr)[Math.floor((currentPage - 1) / 5)];

    // let pageInfo = { arr: currentGroup.map((el) => el) };

    return { arr: currentGroup.map((el: any) => el) };
  };

  // 페이징 처리
  useEffect(() => {
    if (pages.length > 0) {
      makePageInfo(pages);
      setPageGroup(makePageInfo(pages)?.arr);
    }
  }, [pages, currentPage]);

  // 현재 페이지 변경 시 워크플로우 목록 불러오는 파라미터 변경
  useEffect(() => {
    if (currentPage) {
      setListParams((prevState) => ({
        ...prevState,
        skip: (currentPage - 1) * getListParams.limit,
      }));
    }
  }, [currentPage]);

  return { currentPage, setCurrentPage, pageGroup, pages, pageCount };
};
export default usePaginationViewModel;
