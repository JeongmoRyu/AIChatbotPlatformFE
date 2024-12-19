import { useTranslation } from 'react-i18next';
import ClipLoader from 'react-spinners/ClipLoader';

import { ModalBody } from '@/shared/components/ModalComp/view/ModalBody';
import { ModalHeader } from '@/shared/components/ModalComp/view/ModalHeader';
import Input from '@/shared/components/Input/view/Input';

import FileUploadList from './FileUploadList';

import ModalChatbotRegisterViewModel from '../viewModel/ModalChatbotRegisterViewModel';
import { useEffect } from 'react';

function ModalChatbotRegister({ onClose, className, isShowBackdrop }: ChatPlayModalProps) {
  const { t } = useTranslation(['common', 'rag']);

  const {
    currentStep,
    ragModelName,
    handleModelNameChange,
    handleDuplicateCheck,
    duplicateCheckMessage,
    messageColor,
    handleChunkParmas,
    handleCheckStep,
    isModelSaveLoading,
    uploadFiles,
    setUploadFiles,
    setCurrentStep,
    handleOnSaveClick,
    chunkSize,
    checkDuplicate,
    chunkOverlap,
    handleOnCancel,
  } = ModalChatbotRegisterViewModel({ onClose, isShowBackdrop });

  useEffect(() => {
    console.log('isModelSaveLoading', isModelSaveLoading);
  }, [isModelSaveLoading]);

  return (
    <div className={`${className} `}>
      <ModalHeader className="py-5 bg-primary-darkblue ">
        <div className="flex items-center justify-between w-full mx-10 ">
          <div className="text-xl font-bold text-white">{t('rag:신규_문서_등록')}</div>
          <button
            type="button"
            className="w-4 h-4 bg-[url(@/shared/assets/images/image/chatplay/ico_close_w.svg)] bg-no-repeat focus:shadow-none focus:outline-none max-xl:right-4"
            onClick={onClose}
          >
            <span className="sr-only">{t('common:닫기')}</span>
          </button>
        </div>
      </ModalHeader>

      <ModalBody className="overflow-y-auto w-[718px] h-[29.5rem] ">
        <div className="w-full h-full modal-body ">
          {currentStep === 'register' ? (
            <>
              <div className="flex flex-col justify-center h-[330px] ">
                <div className="h-9 bg-point-dark bg-opacity-10 rounded-[10px] mb-6 px-4 py-2.5">
                  <div className="text-sm font-semibold text-gray">
                    {t('rag:주의_한번_설정한_문서명은_변경할_수_없습니다')}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <div className="mb-4">
                    {t('rag:문서명')}
                    <span className="ml-1 text-red-500">*</span>
                  </div>
                  <div className="flex flex-col items-start justify-start mb-4 ">
                    <div className="flex flex-row items-center justify-between border rounded-md border-set-border">
                      <Input
                        id="chunk_size"
                        className="!w-56 border-none"
                        placeholder={t('rag:문서명을_입력해주세요') as string}
                        value={ragModelName || ''}
                        onChange={handleModelNameChange}
                      />
                      <button
                        type="button"
                        className={`text-sm font-medium w-24 h-[50px] rounded-tr-md rounded-br-md ${
                          ragModelName?.trim().length > 0
                            ? 'bg-primary-darkblue text-white border-none'
                            : 'bg-box-default text-gray border-l-set-border border-l-[1px] cursor-not-allowed'
                        }`}
                        onClick={handleDuplicateCheck}
                      >
                        {t('rag:중복_확인')}
                      </button>
                    </div>
                    {duplicateCheckMessage && (
                      <div
                        className={`text-sm ${messageColor === 'blue' ? 'bg-primary-white text-primary-darkblue' : 'text-red-500'}`}
                      >
                        {duplicateCheckMessage}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    Chunk Size (300 ~ 700)
                    <span className="ml-1 text-red-500">*</span>
                  </div>
                  <Input
                    id="chunk_size"
                    className="!w-80 text-right"
                    onChange={(e) => handleChunkParmas(e, 'size')}
                    value={chunkSize || ''}
                    isAutocomplete={false}
                    disabled={!checkDuplicate}
                  />
                </div>
                <div className="flex items-center justify-between mb-20">
                  <div>
                    Chunk Overlap (0 ~ 200)
                    <span className="ml-1 text-red-500">*</span>
                  </div>
                  <Input
                    id="chunk_size"
                    className="!w-80 text-right"
                    onChange={(e) => handleChunkParmas(e, 'overlap')}
                    value={chunkOverlap || ''}
                    isAutocomplete={false}
                    disabled={!checkDuplicate}
                  />
                </div>
              </div>
              <div className="flex justify-center ">
                <button
                  type="button"
                  className="border border-set-border rounded-lg mr-2 w-[88px] h-[50px]"
                  onClick={handleOnCancel}
                >
                  {t('common:취소')}
                </button>
                <button
                  type="button"
                  className="bg-primary-darkblue rounded-lg text-white font-bold mr-2 w-[88px] h-[50px]"
                  onClick={handleCheckStep}
                >
                  {t('common:다음')}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col justify-center h-[340px] ">
                <div className="relative mb-3 text-sm ">
                  {isModelSaveLoading ? (
                    t('rag:신규_문서를_생성중입니다_잠시만_기다려주세요')
                  ) : (
                    <>{t('rag:pdf_문서_파일을_첨부한_후_생성_버튼을_눌러주세요')}</>
                  )}
                </div>
                {!isModelSaveLoading ? (
                  <FileUploadList uploadFiles={uploadFiles} setUploadFiles={setUploadFiles} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ClipLoader size={50} color="#123abc" loading={isModelSaveLoading} />
                  </div>
                )}

                <div className="py-3"></div>
              </div>

              {!isModelSaveLoading && (
                <div className="flex justify-center mt-2 ">
                  <button
                    type="button"
                    className="border border-set-border rounded-lg mr-2 w-[88px] h-[50px]"
                    onClick={() => setCurrentStep('register')}
                  >
                    {t('rag:뒤로')}
                  </button>
                  <button
                    type="button"
                    className="bg-primary-darkblue rounded-lg text-white font-bold mr-2 w-[88px] h-[50px]"
                    onClick={handleOnSaveClick}
                  >
                    {t('rag:생성')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </ModalBody>
    </div>
  );
}

export default ModalChatbotRegister;
