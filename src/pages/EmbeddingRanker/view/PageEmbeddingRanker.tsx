import EditTextInput from '@/pages/Chathub/components/edit/view/EditTextInput';
import FileUploadList from '../components/view/FileUploadList';
// import { EMBEDDING_HISTORY, EMBEDDING_LEADERBOARD } from 'data/routers';
import EmbeddingSetting from '@/pages/EmbeddingRanker/components/view/EmbeddingSetting';
import usePageEmbeddingRankerViewModel from '../viewModel/usePageEmbeddingRankerViewModel';

const PageEmbeddingRanker = () => {
  const {
    settingData,
    handleChangeSetting,
    SELECT_EMBEDDING_MODEL_LIST,
    handleAddModel,
    navigate,
    ChunkingType,
    modelList,
    selectedModels,
    handleModelCheck,
    handleChangeFile,
    fileList,
    progressTitle,
    showProgress,
    runRankerWithSocket,
    progress,
  } = usePageEmbeddingRankerViewModel();
  return (
    <div className="page_ranker">
      <div className="head_wrap">
        {/* <h3 className='page_title'>Embedding Ranker</h3> */}
        <p className="txt_navigation">
          Embedding Ranker<span className="ico_arrow">&gt;</span>
          <em>Create</em>
        </p>
        <button type="button" className="btn_type white big" onClick={() => navigate('/embedding-history')}>
          히스토리
        </button>
      </div>
      <div className="row_box">
        <div className="round_border_box">
          <div className="scroll_wrap">
            <EmbeddingSetting
              type="ranker"
              data={settingData.jsonData}
              onChange={handleChangeSetting}
              embeddingModelList={SELECT_EMBEDDING_MODEL_LIST}
              AddModel={handleAddModel}
            />
          </div>
        </div>
        <div className="round_border_box">
          <div className="scroll_wrap flex_box">
            <div>
              <EditTextInput
                labelText="Chunk 방식"
                id="chunk_method"
                value=""
                onChange={(e) => console.log(e.target.value)}
                isDisabled
                placeholder={ChunkingType}
              />
              <div className="selected_model_box">
                <em className="txt_label">선택된 임베딩 모델</em>
                <ul>
                  {modelList.map((model) => {
                    if (typeof model === 'string') {
                      return (
                        <li key={model} className="input_box_check">
                          <input
                            type="checkbox"
                            id={`selected_embeddingModel_${model}`}
                            checked={selectedModels.includes(model)}
                            onChange={(e) => {
                              handleModelCheck(model, e.target.checked);
                            }}
                          />
                          <label htmlFor={`selected_embeddingModel_${model}`}>{model}</label>
                        </li>
                      );
                    } else {
                      return (
                        <li key={model.name} className="input_box_check">
                          <input
                            type="checkbox"
                            id={`selected_embeddingModel_${model.name}`}
                            checked={selectedModels.some(
                              (selected) => typeof selected !== 'string' && selected.name === model.name,
                            )}
                            onChange={(e) => {
                              handleModelCheck(model.name, e.target.checked, model.ensemble);
                            }}
                          />
                          <label htmlFor={`selected_embeddingModel_${model.name}`}>{model.name}</label>
                        </li>
                      );
                    }
                  })}
                </ul>
                <FileUploadList
                  onChangeFile={handleChangeFile}
                  fileList={fileList}
                  textInfo="*RAG용 자료를 업로드하세요. 각 1GB 이내의 PDF 파일만 업로드 가능합니다."
                  isMultiple={true}
                  accept=".pdf"
                />
              </div>
            </div>
            {showProgress && (
              <div className="progress_box">
                <p className="text-[16px] font-[500] mb-[10px] mt-[10px]">{progressTitle}</p>

                <div className="relative h-2 bg-[#F2F3F7] rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-blue-500 transition-all duration-1000 ease-in-out rounded-[7px]"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #4262FF, #6483FF)',
                    }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-600 text-right">{progress.toFixed(1)}%</div>
              </div>
            )}

            <div className="btn_bottom_box">
              <button
                type="button"
                className="btn_type white big"
                disabled={showProgress}
                onClick={showProgress ? undefined : runRankerWithSocket}
              >
                {showProgress ? '실행중...' : '실행하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PageEmbeddingRanker;
