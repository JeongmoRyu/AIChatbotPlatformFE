import EmbeddingSetting from '../components/view/EmbeddingSetting';
// import { EMBEDDING_RANKER } from 'data/routers';
import Modal from '@/shared/components/modal/view/Modal';
import { TailSpin } from 'react-loader-spinner';
import usePageEmbeddingHistoryViewModel from '../viewModel/usePageEmbeddingHistoryViewModel';
import DataSourcePagination from '@/shared/components/pagination/view/DataSourcePagination';

const PageEmbeddingHistory = () => {
  const {
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
  } = usePageEmbeddingHistoryViewModel();

  return (
    <div className="page_ranker">
      <div className="head_wrap">
        <p className="txt_navigation">
          Embedding Ranker<span className="ico_arrow">&gt;</span>
          <em>History</em>
        </p>
        <button type="button" className="btn_type white big" onClick={() => navigate('/embedding-ranker')}>
          생성하기
        </button>
      </div>

      <div className="row_box">
        <div className="round_border_box">
          <div className="scroll_wrap">
            <div className="flex flex-col justify-between h-full">
              <div className="table_list table_history_list">
                <table>
                  <caption className="screen_hide">Embedding Model Leaderboard - History</caption>
                  <colgroup>
                    <col className="cell_no" />
                    <col className="cell_history_name" />
                    <col className="cell_timestamp" />
                    <col className="cell_author" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col" className="cell_no">
                        No
                      </th>
                      <th scope="col" className="cell_history_name">
                        Name
                      </th>
                      <th scope="col" className="cell_timestamp">
                        <button
                          className="flex items-center justify-between w-full font-medium text-left hover:text-primary-darkblue"
                          onClick={() => {
                            setIsTimeStampAsc((prev) => !prev);
                            setCurrentPage(1);
                          }}
                        >
                          <span>Timestamp</span>
                          <span className="text-xs">{isTimeStampAsc ? '▼' : '▲'}</span>
                        </button>
                      </th>
                      <th scope="col" className="relative cell_author">
                        <div ref={dropdownRef} className="w-full">
                          <button
                            className="flex items-center justify-between w-full font-medium text-left hover:text-primary-darkblue"
                            onClick={() => setIsDropdownOpen((prev) => !prev)}
                          >
                            <span>작성자</span>
                            <span className="text-xs">{isDropdownOpen ? '▲' : '▼'}</span>
                          </button>
                          {isDropdownOpen && (
                            <div className="absolute left-0 z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg top-full">
                              <div className="p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">내 히스토리만 보기</span>
                                  <button
                                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
                                      isMyHistory ? 'bg-primary-darkblue' : 'bg-[#F4F6F8]'
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsMyHistory((prev) => !prev);
                                      setCurrentPage(1);
                                    }}
                                  >
                                    <div
                                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                                        isMyHistory ? 'translate-x-6' : 'translate-x-0'
                                      }`}
                                    />
                                  </button>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {isMyHistory ? '내가 작성한 히스토리만 표시됩니다' : '모든 히스토리가 표시됩니다'}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="py-4 text-center">
                          <div className="h-[50px] flex justify-start w-[80%]">
                            <TailSpin
                              height="40"
                              width="40"
                              color="#4262FF"
                              ariaLabel="tail-spin-loading"
                              radius="4"
                              wrapperStyle={{}}
                              wrapperClass=""
                              visible={true}
                            />
                          </div>
                        </td>
                      </tr>
                    ) : historyData.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-4 text-center">
                          데이터가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      historyData.map((item: any) => (
                        <tr key={item.id}>
                          <td onClick={() => handleRowClick(item)} className="cursor-pointer">
                            {item.row_number}
                          </td>
                          <td onClick={() => handleRowClick(item)} className="cursor-pointer">
                            <span className="second_line_ellipsis">{item.name}</span>
                          </td>
                          <td onClick={() => handleRowClick(item)} className="cursor-pointer">
                            {item.embedding_status === 'P' ? (
                              <span className="state">생성중...</span>
                            ) : (
                              <span className="second_line_ellipsis">{item.time_stamp}</span>
                            )}
                          </td>
                          <td onClick={() => handleRowClick(item)} className="cursor-pointer">
                            {item.creator}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <DataSourcePagination />
            </div>
          </div>
        </div>
        <div className="round_border_box">
          <div className="scroll_wrap">
            <EmbeddingSetting
              type="history"
              data={settingData.jsonData}
              files={fileList}
              data_id={settingData.id}
              setIsModalVisible={setIsModalVisible}
              embeddingFin={EmbeddingFin}
            />
          </div>
        </div>
      </div>
      <Modal
        isShow={isModalVisible}
        title={
          settingData.id
            ? `Delete ${settingData.jsonData.name.length > 20 ? settingData.jsonData.name.slice(0, 19) + '...' : settingData.jsonData.name}`
            : ''
        }
        width={400}
        onClose={handleModalClose}
        okButtonText="Delete"
        okButtonClick={handleModalCheck}
        cancelButtonText="Close"
        cancleButtonClick={handleModalClose}
      >
        <div className="text-center mb-2 px-[10px] break-keep">
          {/* <p className='text-[#fe4336]'>{caption} 챗봇을 지우신다면 되돌릴 수 없습니다.</p> */}
          {settingData.id && (
            <div>
              <p className="max-w-full truncate" title={settingData.jsonData.name}>
                {settingData.jsonData.name.length > 36
                  ? `${settingData.jsonData.name.slice(0, 35)}...`
                  : settingData.jsonData.name}
              </p>
              <p>지우신다면 되돌릴 수 없습니다.</p>
            </div>
          )}
        </div>
        <div className="file_list_box">
          <div className="txt_center text-[#fe4336]">
            <p className="mb-2">
              {settingData.id && (
                <span className="inline-block max-w-full truncate" title={settingData.jsonData.name}>
                  {settingData.jsonData.name.length > 36
                    ? `${settingData.jsonData.name.slice(0, 35)}... 지우시겠습니까?`
                    : `${settingData.jsonData.name} 지우시겠습니까?`}
                </span>
              )}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default PageEmbeddingHistory;
