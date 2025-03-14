import { useForm } from 'react-hook-form';

import Textarea from '@/shared/components/Textarea/view/Textarea';
import Input from '@/shared/components/Input/view/Input';
import Select from '@/shared/components/Select/view/Select';
import LabelComponent from '@/shared/components/LabelComponent/view/LabelComponent';
import GeneralButton from '@/shared/components/GeneralButton/view/GeneralButton';
import ModalRetreivalSetting from '../modal/ModalRetreivalSetting/view/ModalRetreivalSetting';
import ChatPlayPiplelineTab from '@/pages/Chatplay/view/ChatPlayPipelineTab';
import ChatPlayTestLog from './ChatPlayTestLog';
import { EngineParameterInputChatPlay } from '../view/EngineParameterInputChatPlay';

import useChatPlayPipelineFlowViewModel from '../viewModel/useChatPlayPipelineFlowViewModel';

import ico_close_2x from '@/shared/assets/images/image/chatplay/ico_close@2x.png';
import plus from '@/shared/assets/images/image/chatplay/plus_gray_icon.svg';
import { useTranslation } from 'react-i18next';

interface IFormValues {
  name: string;
  system_prompt: string;
  retriever_id: number | null;
  llm_workflow_id: number | null;
  llm_configs: IEngineParameterChatPlay[];
  retriever_top_k: number | null;
}

function ChatPlayPipelineFlow({ socket }: { socket: any }) {
  const { t } = useTranslation(['chatplay']);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors },
    getValues,
  } = useForm<IFormValues>({
    defaultValues: {
      name: '',
      system_prompt: '',
      retriever_id: null,
      llm_workflow_id: null,
      llm_configs: [],
      retriever_top_k: null,
    },
  });

  const {
    activeTab,
    onSubmit,
    clickStates,
    handleToggleClick,
    isRagModelCreating,
    handleOpenRagList,
    enginData,
    currentRAGLabel,
    handleEngineChange,
    llmEngineList,
    selectedLLMEngine,
    refineEngineConfig,
    checkDisabled,
    selectedRetreivalModal,
    closeModal,
    selectedChatbot,
    currentLLMLabel,
  } = useChatPlayPipelineFlowViewModel({ watch, reset, setValue, socket });

  return (
    <div className=" bg-white border-l-0.1 border-l-[#d0d9e3] overflow-y-auto overflow-x-hidden">
      <ChatPlayPiplelineTab />

      {activeTab === 'setting' && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="xl:flex flex-col justify-top w-[30rem] px-10 py-5 border-l border-l-[#d0d9e3] overflow-y-hidden ">
            <>
              <div className="flex items-center justify-between my-4">
                <LabelComponent text={t('챗봇명')} required />
                <Input
                  id="name"
                  {...register('name')}
                  placeholder={t('챗봇명을_입력하세요') as string}
                  maxLength={20}
                  className="!w-80"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="flex flex-col items-center justify-between intro-y sm:flex-row">
                <h4 className="flex items-center mr-6 text-xl font-bold leading-10">{t('chatplay:문서_설정')}</h4>
                <img
                  src={ico_close_2x}
                  alt="Close"
                  className={`w-5 h-5 ml-1 transition-transform duration-300 cursor-pointer ${
                    !clickStates.ragClick ? 'rotate-180' : ''
                  }`}
                  onClick={() => handleToggleClick('ragClick')}
                />{' '}
              </div>
              <div className="border-b-2 border-solid border-black w-full mb-2.5 "></div>

              {clickStates.ragClick && (
                <>
                  <GeneralButton
                    type="submit"
                    name="submit"
                    className="flex flex-row items-center justify-center w-full h-12 mt-2 mb-4 border rounded-md border-set-border"
                    onClick={handleOpenRagList}
                  >
                    <img src={plus} alt="register rag" className="pr-4" />
                    <div>{t('chatplay:문서_등록하기')}</div>
                  </GeneralButton>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {t('chatplay:문서_선택')}
                      <span className="ml-1 text-red-500">*</span>
                    </div>
                    <Select
                      register={{ ...register('retriever_id') }}
                      id="retriever_id"
                      typeList={enginData.rag}
                      placeholder={t('chatplay:등록한_문서를_선택하세요') as string}
                      defaultValue={selectedChatbot?.retriever_id}
                      defaultLabel={currentRAGLabel}
                      boxClassName="w-60"
                      onClick={(e) => {
                        handleEngineChange(e, 'retriever_id');
                      }}
                      error={errors.hasOwnProperty('retriever_id')}
                    />
                  </div>
                  <div className="flex items-center justify-between ">
                    <LabelComponent text={'Top K'} required />
                    <Input
                      {...register('retriever_top_k')}
                      id="retriever_top_k"
                      type="number"
                      min={0}
                      className="!w-60"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-end"></div>
                </>
              )}
            </>

            <div className="flex flex-col items-center justify-between mt-8 intro-y sm:flex-row">
              <h4 className="flex items-center mr-6 text-xl font-bold leading-10">{t('chatplay:LLM_모델_설정')}</h4>
              <img
                src={ico_close_2x}
                alt="Close"
                className={`w-5 h-5 ml-1 transition-transform duration-300 cursor-pointer ${
                  !clickStates.llmClick ? 'rotate-180' : ''
                }`}
                onClick={() => handleToggleClick('llmClick')}
              />{' '}
            </div>
            <div className="border-b-2 border-solid border-black w-full mb-2.5"></div>
            {clickStates.llmClick && llmEngineList && llmEngineList.length > 0 && (
              <div className="flex flex-col justify-between">
                <div className="flex flex-row items-center justify-between">
                  <div>
                    {t('chatplay:모델_선택')}
                    <span className="ml-1 text-red-500">*</span>
                  </div>
                  <Select
                    register={{ ...register('llm_workflow_id') }}
                    id="llm_workflow_id"
                    typeList={llmEngineList}
                    placeholder={t('엔진을_선택해주세요') as string}
                    defaultValue={selectedChatbot?.llm_workflow_id}
                    defaultLabel={currentLLMLabel}
                    boxClassName="w-60"
                    onClick={(e) => {
                      handleEngineChange(e, 'llm_workflow_id');
                    }}
                    error={errors.hasOwnProperty('llm_workflow_id')}
                  />
                </div>
                {selectedLLMEngine && (
                  <EngineParameterInputChatPlay
                    engineParams={
                      selectedLLMEngine.llm_workflow_id === selectedChatbot?.llm_workflow_id
                        ? selectedChatbot?.llm_configs
                        : refineEngineConfig(selectedLLMEngine.config)
                    }
                    engineInfo={enginData}
                    paramType="llm"
                    setValue={setValue as (field: string, value: any) => void}
                    control={control}
                    language={'ko'}
                    getValue={getValues}
                    watch={watch}
                  />
                )}
              </div>
            )}

            <div>
              <div className="flex flex-col items-center justify-between mt-8 intro-y sm:flex-row">
                <div className="flex items-center mr-6 text-xl font-bold leading-10">{t('chatplay:프롬프트_작성')}</div>
                <img
                  src={ico_close_2x}
                  alt="Close"
                  className={`w-5 h-5 ml-1 transition-transform duration-300 cursor-pointer ${
                    clickStates.promptClick ? '' : 'rotate-180'
                  }`}
                  onClick={() => handleToggleClick('promptClick')}
                />
              </div>
              <div className="w-full mb-5 border-b-2 border-gray-400 border-solid"></div>
              {clickStates.promptClick && (
                <div>
                  <div>
                    <div className="flex items-center justify-between">
                      <LabelComponent text={t('chatplay:시스템_프롬프트')} required />
                      <div className="text-gray">{`(${watch('system_prompt').length}/${t('chatplay:200자')})`}</div>
                    </div>
                    <Textarea
                      id="system_prompt"
                      {...register('system_prompt')}
                      placeholder={t('chatplay:챗봇이_해야_하는_역할에_대해_구체적으로_입력해주세요') as string}
                      boxClassName="multi !h-36"
                      maxLength={200}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end sticky h-[110px]  bg-white border-l-0.1 border-l-[#d0d9e3]">
            <button
              type="submit"
              className={`border border-set-border rounded-lg w-32 h-12 absolute right-[30px] ${
                checkDisabled() ? 'cursor-not-allowed bg-[#f4f5f8] text-gray' : 'bg-primary-darkblue text-white'
              }`}
              disabled={checkDisabled()}
            >
              {t('chatplay:대화_저장')}
            </button>
          </div>
        </form>
      )}

      {/* // 테스트 로그 */}
      {activeTab === 'testlog' && <ChatPlayTestLog />}
      <>
        {selectedRetreivalModal.isShow && <div className={`bg-black/60 w-full h-full absolute top-0 left-0 z-50 `} />}
        <ModalRetreivalSetting isShow={selectedRetreivalModal.isShow} onClose={closeModal} />
      </>
    </div>
  );
}

export default ChatPlayPipelineFlow;
