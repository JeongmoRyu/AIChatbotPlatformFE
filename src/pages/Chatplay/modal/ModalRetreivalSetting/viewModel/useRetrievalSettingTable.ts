import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { checkList as retreivlCheckList } from '@/shared/store/rag';
import { pageIndex } from '@/shared/store/page-data';

interface Props {
  fetchListData: fetchRetreivalListDataProps[];
}

const useRetrievalSettingTable = ({ fetchListData }: Props) => {
  const [checkList, setCheckList] = useRecoilState<any>(retreivlCheckList);

  const [selectedRetreivalDetailModal, setSelectedRetrievalDetailModal] = useState<MODAL_RETREIVAL_TYPE>({
    isShow: false,
    name: '',
    id: 0,
  });
  const currentPage = useRecoilValue(pageIndex);

  const convertToDataFormat = (fullDate: string) => {
    return fullDate ? fullDate.split(' ')[0] : '';
  };

  const convertToTimeFormat = (fullDate: string) => {
    return fullDate ? fullDate.split(' ')[1] : '';
  };

  useEffect(() => {
    setCheckList([]);
  }, [currentPage]);

  const handleDetailData = (e: React.MouseEvent<HTMLDivElement>, item: any) => {
    e.preventDefault();
    console.log('item', item);

    setSelectedRetrievalDetailModal({ isShow: true, id: item.retriever_id, name: item.model_name });
  };

  const onChangeCheckList = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    const nameAsNumber = Number(name);

    if (checked) {
      setCheckList((prev: any) => [...prev, nameAsNumber]);
    } else {
      setCheckList((prev: any) => prev.filter((item: any) => item !== nameAsNumber));
    }
  };

  const handleCloseModal = () => {
    setSelectedRetrievalDetailModal((prev: any) => ({
      ...prev,
      isShow: false,
      id: 0,
      name: '',
    }));
  };

  const handleClickAll = () => {
    checkList.includes('all') ? setCheckList([]) : setCheckList(['all']);

    const usedList = fetchListData.filter((item) => item.used_by_chatbot === true);

    if (checkList.length === fetchListData.length - usedList.length) {
      setCheckList([]);
    } else {
      setCheckList(
        fetchListData.filter((item) => item.used_by_chatbot !== true).map((item) => Number(item.retriever_id)),
      );
    }
  };

  return {
    handleClickAll,
    checkList,
    onChangeCheckList,
    handleDetailData,
    convertToDataFormat,
    selectedRetreivalDetailModal,
    handleCloseModal,
    convertToTimeFormat,
  };
};

export default useRetrievalSettingTable;
