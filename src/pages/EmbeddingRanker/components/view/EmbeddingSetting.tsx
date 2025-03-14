import EditToggle from '@/shared/components/toggle/view/EditToggle';
import EditTextInput from '@/pages/Chathub/components/edit/view/EditTextInput';
import EditSelectBox from '@/pages/Chathub/components/edit/view/EditSelectBox';
import EditCounter from '@/pages/Chathub/components/edit/view/EditCounter';
import DragSlider from './DragSlider';
import icon_up from '@/shared/assets/images/icons/icon_up.svg';
import icon_x from '@/shared/assets/images/icons/ico_x_16.svg';
import EditSelectCodeBox from '@/pages/Chathub/components/edit/view/EditSelectCodeBox';
// import { EMBEDDING_HISTORY, EMBEDDING_LEADERBOARD } from 'data/routers';
import { showNotification } from '@/shared/utils/common-helper';
import useEmbeddingSettingViewModel from '../viewModel/useEmbeddingSettingViewModel';

interface Props {
  type: 'ranker' | 'history';
  data: IRankerDataJson;
  onChange?: (type: string, key: string, value: any) => void;
  embeddingModelList?: SelectListType[];
  AddModel?: (name: string, type: string, model: ICustomModel) => void;
  files?: string[];
  data_id?: number;
  setIsModalVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteSuccess?: () => void;
  embeddingFin?: boolean;
}

const EmbeddingSetting = ({
  type,
  data,
  onChange,
  embeddingModelList,
  AddModel,
  files,
  data_id,
  setIsModalVisible,
  embeddingFin,
}: Props) => {
  const {
    handleChange,
    openAccordion,
    handleAccordion,
    min,
    max,
    SELECT_TYPE_LIST,
    SELECT_EMBEDDING_LIST,
    rrfSelectValue,
    handleModelSelect,
    selectedRrfModels,
    handleModelDelete,
    handleWeightChange,
    rrfModelName,
    setRrfModelName,
    getFileIcon,
    handleDeleteDetail,
    navigate,
  } = useEmbeddingSettingViewModel({
    onChange,
    data_id,
    setIsModalVisible,
  });

  return (
    <>
      <div className="w-full h-full relative">
        {/* {type === 'history' && isLoading && (
        <div className='absolute inset-0 flex justify-center items-center z-10 overflow-hidden'>
          <TailSpin
            height='80'
            width='80'
            color='#4262FF'
            ariaLabel='tail-spin-loading'
            radius='2'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
          />
        </div>
      )} */}
        <EditTextInput
          id="rankName"
          labelText="이름"
          isEssential={true}
          isDisabled={type === 'history'}
          value={data.name}
          onChange={(e) => handleChange('name', '', e.target.value)}
        />
        <div id="chunkSettings" className={`accordion_box ${openAccordion.chunkSettings ? 'open' : ''}`}>
          <button type="button" className="accordion_btn" onClick={handleAccordion}>
            Chunk Settings
            <img className="ico_up" src={icon_up} alt={openAccordion.chunkSettings ? '접기' : '펼치기'} />
          </button>
          <div className="accordion_content">
            <EditToggle
              title="Fixed-size chunking"
              id="fixedSizeChunking"
              value={data.chunking_settings.use_fixed_chunk}
              onChange={(value) => handleChange('chunking_settings', 'use_fixed_chunk', value)}
            />
            <DragSlider
              label="Chunk 사이즈"
              smallText="단위 : 토큰"
              min={min}
              max={max}
              value={data.chunking_settings.fixed_chunk_size}
              // initialValue={data.chunking_settings.fixed_chunk_size}
              onChange={(value: any) => handleChange('chunking_settings', 'fixed_chunk_size', value)}
              isDisabled={type === 'history'}
            />
            <DragSlider
              label="Chunk overlap"
              smallText="단위 : 토큰"
              min={min}
              max={max}
              value={data.chunking_settings.fixed_chunk_overlap}
              // initialValue={data.chunking_settings.fixed_chunk_overlap}
              onChange={(value: any) => handleChange('chunking_settings', 'fixed_chunk_overlap', value)}
              isDisabled={type === 'history'}
            />
            <EditToggle
              title="Semantic chunking"
              id="semanticChunking"
              value={data.chunking_settings.use_semantic_chunk}
              onChange={(value) => handleChange('chunking_settings', 'use_semantic_chunk', value)}
            />
            <EditSelectCodeBox
              // type=''
              list={SELECT_TYPE_LIST}
              labelText="타입"
              name="chunkSettingType"
              activeValue={data.chunking_settings.semantic_chunk_bp_type}
              onChange={(value) => handleChange('chunking_settings', 'semantic_chunk_bp_type', value)}
            />
            <EditSelectCodeBox
              // type=''
              list={SELECT_EMBEDDING_LIST}
              labelText="사용할 임베딩"
              name="useEmbedding"
              activeValue={data.chunking_settings.semantic_chunk_embedding}
              onChange={(value) => handleChange('chunking_settings', 'semantic_chunk_embedding', value)}
            />
          </div>
        </div>
        <div id="retrieverSettings" className={`accordion_box ${openAccordion.retrieverSettings ? 'open' : ''}`}>
          <button type="button" className="accordion_btn" onClick={handleAccordion}>
            Retriever Settings
            <img className="ico_up" src={icon_up} alt={openAccordion.retrieverSettings ? '접기' : '펼치기'} />
          </button>
          <div className="accordion_content">
            <div className="rank_box">
              <div className="box_left">
                <p>가져오는 문서의 갯수</p>
              </div>
              <div className="box_right">
                <EditCounter
                  fix={1}
                  title="Top K"
                  id="retrieverDocumentNumber"
                  value={String(data.top_k)}
                  onChange={(value) => handleChange('top_k', '', parseInt(value))}
                />
              </div>
            </div>
          </div>
        </div>
        {type === 'ranker' && (
          <>
            <div id="rpf" className={`accordion_box ${openAccordion.rpf ? 'open' : ''}`}>
              <button type="button" className="accordion_btn" onClick={handleAccordion}>
                앙상블 리트리버 추가하기 (RRF)
                <img className="ico_up" src={icon_up} alt={openAccordion.rpf ? '접기' : '펼치기'} />
              </button>
              <div className="accordion_content">
                {embeddingModelList && (
                  <EditSelectBox
                    type=""
                    list={embeddingModelList}
                    labelText="임베딩 모델 선택"
                    name="embeddingModel"
                    activeValue={rrfSelectValue}
                    onChange={(value) => handleModelSelect(value, embeddingModelList)}
                  />
                )}
                <div className="selected_list">
                  <ul>
                    {selectedRrfModels.map((model: any) => (
                      <li key={model.model}>
                        {model.model}
                        <button
                          type="button"
                          className="btn_list_delete"
                          onClick={() => handleModelDelete(model.model)}
                        >
                          <img src={icon_x} alt="삭제" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                {selectedRrfModels.map((model: any, index: number) => (
                  <div className="rank_box" key={`weight_${model.model}`}>
                    <div className="box_left">
                      <p>{index === 0 ? '모델 가중치 조절' : ''}</p>
                    </div>
                    <div className="box_right">
                      <EditCounter
                        title={model.model}
                        id={`weight_${model.model}`}
                        value={String(model.weight.toFixed(1))}
                        step={0.1}
                        onChange={(value) => handleWeightChange(model.model, Number(value))}
                      />
                    </div>
                  </div>
                ))}
                <EditTextInput
                  labelText="사용할 모델명"
                  id="useModel"
                  value={rrfModelName}
                  onChange={(e) => setRrfModelName(e.target.value)}
                />
                <div className="btn_box">
                  <button
                    type="button"
                    className="btn_type white big"
                    onClick={() => {
                      if (!rrfModelName) {
                        showNotification('모델명을 입력해주세요.', 'error');
                        return;
                      }
                      if (selectedRrfModels.length === 0) {
                        showNotification('하나 이상의 모델을 선택해주세요.', 'error');
                        return;
                      }
                      const customModel: ICustomModel = {
                        name: rrfModelName,
                        ensemble: selectedRrfModels,
                      };

                      AddModel && AddModel(rrfModelName, 'ranker', customModel);
                      setRrfModelName('');
                    }}
                  >
                    추가하기
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {type === 'history' && (
          <>
            <div id="embeddingList" className={`accordion_box ${openAccordion.embeddingList ? 'open' : ''}`}>
              <button type="button" className="accordion_btn" onClick={handleAccordion}>
                사용한 임베딩 모델
                <img className="ico_up" src={icon_up} alt={openAccordion.embeddingList ? '접기' : '펼치기'} />
              </button>
              <div className="accordion_content bg-[#f2f3f7] p-2">
                <ul className="p-5 space-y-2.5">
                  {data.embedding_models.map((model, index) => (
                    <li key={index}>
                      {typeof model === 'string' ? (
                        <strong className="pl-4 block">{model}</strong>
                      ) : (
                        <div>
                          <strong className="pl-4 block">{model.name}</strong>
                          <ul className="list-disc pl-11">
                            {model.ensemble.map((weightItem, weightIndex) => (
                              <li key={weightIndex}>
                                {weightItem.model} (weight: {weightItem.weight})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div id="fileList" className={`accordion_box ${openAccordion.fileList ? 'open' : ''}`}>
              <button type="button" className="accordion_btn" onClick={handleAccordion}>
                첨부 파일 목록
                <img className="ico_up" src={icon_up} alt={openAccordion.fileList ? '접기' : '펼치기'} />
              </button>
              <div className="accordion_content">
                <ul className="file_list">
                  {files &&
                    files.length > 0 &&
                    files.map((item, index) => (
                      <div key={`${item}_${index}`} className={`flex ${index > 0 ? 'mt-[15px]' : 'mt-[5px]'}`}>
                        <img src={getFileIcon(item)} alt={item} className="mr-2 w-5 h-5" />
                        <p>{item}</p>
                      </div>
                    ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-row justify-end space-x-2">
              <div className="btn_box">
                {/* <button type='button' className='btn_type white big' onClick={() => navigate(EMBEDDING_LEADERBOARD)}> */}
                <button type="button" className="btn_type red big" onClick={handleDeleteDetail}>
                  삭제하기
                </button>
              </div>
              <div className="btn_box">
                {/* <button type='button' className='btn_type white big' onClick={() => navigate(EMBEDDING_LEADERBOARD)}> */}
                {embeddingFin ? (
                  <button
                    type="button"
                    className="btn_type white big"
                    onClick={() => navigate('/embedding-leaderboard', { state: { id: data_id, topK: data.top_k } })}
                  >
                    QA 데이터/랭킹
                  </button>
                ) : (
                  <button type="button" className="btn_type grey big">
                    QA 데이터/랭킹
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default EmbeddingSetting;
