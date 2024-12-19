import { TailSpin } from 'react-loader-spinner';
import DataSourcePagination from '@/shared/components/pagination/view/DataSourcePagination';
import usePageEmbeddingLeaderboardVM from '../viewModel/usePageEmbeddingLeaderboardVM';

const PageEmbeddingLeaderBoard = () => {
  const {
    exportToExcel,
    handleNavigateToHistory,
    TABS,
    tabActive,
    tabClick,
    dataToDisplay,
    isLoading,
    handleModalClick,
    leaderboardTopK,
    selectedText,
    handleModalClose,
    modalRect,
  } = usePageEmbeddingLeaderboardVM();
  return (
    <div className="page_ranker bg_white">
      <div className="head_wrap">
        <p className="txt_navigation">
          Embedding Ranker<span className="ico_arrow">&gt;</span>
          <em>QA 데이터 및 랭킹</em>
        </p>
        <div className="flex flex-row space-x-2">
          <button type="button" className="btn_type white big" onClick={exportToExcel}>
            {/* {tabActive} 저장하기 */}
            Data 저장하기
          </button>
          <button type="button" className="btn_type white big" onClick={handleNavigateToHistory}>
            히스토리
          </button>
        </div>
      </div>

      <ul className="tab_menu">
        {TABS.map((item: any) => (
          <li key={item.id} className={`${tabActive === item.id ? 'active' : ''}`}>
            <a href={`#${item.id}`} onClick={(e) => tabClick(e, item.id)}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="tab_content">
        {tabActive === 'QaData' && (
          <>
            <div className="flex flex-col justify-between h-full">
              <div className="table_list">
                <table>
                  <caption className="screen_hide">Embedding Model Leaderboard - QA 데이터</caption>
                  <colgroup>
                    <col className="cell_no" />
                    <col className="cell_question" />
                    <col className="cell_answer" />
                    <col className="cell_id" />
                    <col className="cell_chunk" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col" className="cell_no">
                        No
                      </th>
                      <th scope="col" className="cell_question">
                        Question
                      </th>
                      <th scope="col" className="cell_answer">
                        Answer
                      </th>
                      <th scope="col" className="cell_id">
                        doc_id
                      </th>
                      <th scope="col" className="cell_chunk">
                        chunk
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={1} className="text-left py-4">
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
                    ) : dataToDisplay.length === 0 ? (
                      <tr>
                        <td colSpan={1} className="text-left py-4">
                          데이터가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      dataToDisplay.map((item: any, index: number) => (
                        <tr key={`qa_${index}`}>
                          <td>{(item as QADetailData).row_number}</td>
                          <td>
                            <button
                              type="button"
                              className="btn_cell_modal"
                              onClick={(e) =>
                                handleModalClick(
                                  e,
                                  `${tabActive}_${(item as QADetailData).id}_1`,
                                  (item as QADetailData).question,
                                )
                              }
                            >
                              <span className="second_line_ellipsis">{(item as QADetailData).question}</span>
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn_cell_modal"
                              onClick={(e) =>
                                handleModalClick(
                                  e,
                                  `${tabActive}_${(item as QADetailData).id}_2`,
                                  (item as QADetailData).answer,
                                )
                              }
                            >
                              <span className="second_line_ellipsis">{(item as QADetailData).answer}</span>
                            </button>
                          </td>
                          <td>{(item as QADetailData).doc_id}</td>
                          <td>
                            <button
                              type="button"
                              className="btn_cell_modal"
                              onClick={(e) =>
                                handleModalClick(
                                  e,
                                  `${tabActive}_${(item as QADetailData).id}_3`,
                                  (item as QADetailData).chunk,
                                )
                              }
                            >
                              <span className="second_line_ellipsis">{(item as QADetailData).chunk}</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <DataSourcePagination />
            </div>
          </>
        )}
        {tabActive === 'Ranking' && (
          <>
            <div className="flex flex-col justify-between h-full">
              <div className="table_list">
                <table>
                  <caption className="screen_hide">Embedding Model Leaderboard - 랭킹</caption>
                  <colgroup>
                    <col className="cell_no" />
                    <col className="cell_name" />
                    <col className="cell_embedding" />
                    <col className="cell_accuracy" />
                    <col className="cell_etc" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col" className="cell_no">
                        No
                      </th>
                      <th scope="col" className="cell_name">
                        이름
                      </th>
                      <th scope="col" className="cell_embedding">
                        임베딩 모델 구성
                      </th>
                      <th scope="col" className="cell_accuracy">
                        @{leaderboardTopK} hit accuracy (%)
                      </th>
                      <th scope="col" className="cell_etc">
                        비고
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={1} className="text-left py-4">
                          로딩중...
                        </td>
                      </tr>
                    ) : dataToDisplay.length === 0 ? (
                      <tr>
                        <td colSpan={1} className="text-left py-4">
                          데이터가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      dataToDisplay.map((item: any, index: number) => (
                        <tr key={`ranking_${index}`}>
                          <td>{(item as RankingDetailData).row_number}</td>
                          <td>
                            <button
                              type="button"
                              className="btn_cell_modal"
                              onClick={(e) =>
                                handleModalClick(e, `Ranking_${item.id}_name`, (item as RankingDetailData).model_name)
                              }
                            >
                              <span className="second_line_ellipsis">{(item as RankingDetailData).model_name}</span>
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn_cell_modal"
                              onClick={(e) =>
                                handleModalClick(
                                  e,
                                  `Ranking_${item.id}_embedding`,
                                  (item as RankingDetailData).embedding_model_config,
                                )
                              }
                            >
                              <span className="second_line_ellipsis">
                                {(item as RankingDetailData).embedding_model_config}
                              </span>
                            </button>
                          </td>
                          <td>{(item as RankingDetailData).hit_accuracy.toFixed(2)}</td>
                          <td>
                            <button
                              type="button"
                              className="btn_cell_modal"
                              onClick={(e) =>
                                handleModalClick(
                                  e,
                                  `Ranking_${(item as RankingDetailData).row_number}_etc`,
                                  (item as RankingDetailData).description,
                                )
                              }
                            >
                              <span className="second_line_ellipsis">{(item as RankingDetailData).description}</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <DataSourcePagination />
            </div>
          </>
        )}
      </div>
      {selectedText && (
        <div className="cell_modal_wrap" onClick={handleModalClose}>
          <div className="cell_modal" style={{ left: modalRect.x, top: modalRect.y, width: modalRect.w }}>
            <p>{selectedText}</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default PageEmbeddingLeaderBoard;
