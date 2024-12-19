import { useTranslation } from 'react-i18next';
import Checkbox from '@/shared/components/Checkbox/view/Checkbox';
import ModalRetreivalDetail from './ModalRetreivalDetail';
import useRetrievalSettingTable from '../viewModel/useRetrievalSettingTable';

interface Props {
  fetchListData: fetchRetreivalListDataProps[];
}

function RetrievlSettingTable({ fetchListData }: Props) {
  const { t } = useTranslation(['rag']);

  const {
    handleClickAll,
    checkList,
    onChangeCheckList,
    handleDetailData,
    convertToDataFormat,
    selectedRetreivalDetailModal,
    handleCloseModal,
    convertToTimeFormat,
  } = useRetrievalSettingTable({ fetchListData });

  return (
    <div className="w-full overflow-x-auto">
      <table className="tableChatplay">
        <thead>
          <tr>
            <th className="px-1 whitespace-nowrap" scope="col">
              <Checkbox
                id="selectAll"
                name="selectAll"
                value=""
                disabled={false}
                onChange={handleClickAll}
                checked={checkList.length === fetchListData.length}
              />
            </th>
            <th className="px-1 whitespace-nowrap" scope="col">
              No
            </th>
            <th className="px-1 whitespace-nowrap" scope="col">
              {t('rag:문서명')}
            </th>
            <th className="px-1 whitespace-nowrap" scope="col">
              {t('rag:쳥크사이즈')}
            </th>
            <th className="px-1 whitespace-nowrap" scope="col">
              {t('rag:청크_오버랩')}
            </th>
            <th className="px-1 whitespace-nowrap" scope="col">
              {t('rag:등록_수정_일시')}
            </th>
            <th className="px-1 whitespace-nowrap" scope="col">
              {t('rag:임베딩_진행_상황')}
            </th>
          </tr>
        </thead>

        <tbody>
          {fetchListData &&
            fetchListData.map((item: any, index) => (
              <tr key={`${item.id}${index}`}>
                <td scope="row">
                  <div className="z-10 tooltip-container">
                    <Checkbox
                      id={item.retriever_id}
                      name={item.retriever_id}
                      className={`listChk`}
                      checked={checkList.includes(item.retriever_id)}
                      onChange={(e: any) => {
                        onChangeCheckList(e);
                      }}
                      disabled={item.used_by_chatbot || false}
                    />
                    {item.used_by_chatbot && <div className="tooltip">{t('rag:챗봇에서_사용중인_문서입니다')}</div>}
                  </div>
                </td>
                <td>{item.no}</td>

                <td>
                  <div
                    className="cursor-pointer text-primary-darkblue"
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => handleDetailData(e, item)}
                  >
                    {item.model_name}
                  </div>
                </td>

                <td>{item.chunk_size}</td>
                <td>{item.chunk_overlap}</td>
                <td>
                  {convertToDataFormat(item.updated_at)}
                  <br />
                  {convertToTimeFormat(item.updated_at)}
                </td>
                <td>{t(item.status)}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <>
        {selectedRetreivalDetailModal.isShow && (
          <div className={`bg-black/60 w-full h-full absolute top-0 left-0 z-10 `} />
        )}
        <ModalRetreivalDetail
          name={selectedRetreivalDetailModal.name}
          retriever_id={selectedRetreivalDetailModal.id ?? 0}
          isShow={selectedRetreivalDetailModal.isShow}
          className={`modal-template transition-transform duration-3000 ease ${
            selectedRetreivalDetailModal.isShow ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
          }`}
          onClose={handleCloseModal}
        />
      </>
    </div>
  );
}

export default RetrievlSettingTable;
