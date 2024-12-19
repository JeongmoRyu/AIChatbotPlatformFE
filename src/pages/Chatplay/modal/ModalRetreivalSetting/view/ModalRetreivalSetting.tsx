import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { ModalChatplay } from '@/pages/Chatplay/modal/ModalChatplay/view/ModalChatplay';
import { ModalBody } from '@/shared/components/ModalComp/view/ModalBody';
import { ModalHeader } from '@/shared/components/ModalComp/view/ModalHeader';

import LoadingUI from '@/shared/components/LoadingUI/view/LoadingUI';
import ContentTitle from '@/shared/components/ContentTitle/view/ContentTitle';
import ListArea from '@/shared/components/ListArea/view/ListArea';
import Pagination from '@/shared/components/pagination/view/Pagination';
import ResultNotFound from '@/shared/components/ResultNotFound/view/ResultNotFound';
import NotLoginInfo from '@/shared/components/NotLoginInfo/view/NotLoginInfo';

import ModalConfirmDelete from '../../ModalConfirmDelete/view/ModalConfirmDelete';
import ModalChatbotRegister from '../../ModalChatbotRegister/view/ModalChatbotRegister';
import RetrievlSettingTable from './RetrievlSettingTable';
import useModalRetreivalSettingViewModel from '../viewModel/useModalRetreivalSettingViewModel';

interface ModalRetreivalSettingProps {
  isShow: boolean;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const ModalRetreivalSetting = ({ isShow, onClose, className }: ModalRetreivalSettingProps) => {
  const { t } = useTranslation(['chatplay', 'rag', 'button']);

  const {
    isRagModelCreating,
    refContent,
    deleteButtonRef,
    handleDeleteModal,
    totalCount,
    fetchListData,
    userLoginState,
    isShowModal,
    closeModal,
    isShowBackdrop,
    handleRegisterModal,

    modalRef,
  } = useModalRetreivalSettingViewModel();

  return (
    <div className={`modal !top-20 max-w-[1344px] w-full z-10   ${isShow ? 'show' : ''} ${className}`} ref={modalRef}>
      <div className="modal-dialog">
        <div className="overflow-hidden modal-content ">
          <ModalHeader className="flex justify-between p-5 bg-primary-darkblue">
            <h2 className="text-lg font-bold text-white">{t('chatplay:문서_등록하기')}</h2>
            <button
              type="button"
              className={`${isRagModelCreating ? `cursor-not-allowed` : `cursor-pointer`} w-4 h-4 bg-[url(@/shared/assets/images/image/chatplay/ico_close_w.svg)] bg-no-repeat focus:shadow-none focus:outline-none max-xl:right-4`}
              onClick={onClose}
            >
              <span className="sr-only">{'닫기'}</span>
            </button>
          </ModalHeader>
          <ModalBody className="h-[70vh] ">
            <div ref={refContent} className="h-full overflow-y-auto modal-body ">
              <Suspense fallback={<LoadingUI />}>
                <section className="mt-0">
                  <div className="flex justify-start w-full">
                    <div className="contents-title !mb-0">
                      <div className="title-txt">
                        <h2> {t('chatplay:문서_등록하기')}</h2>
                      </div>
                    </div>
                  </div>
                </section>
                <ContentTitle
                  title={t('rag:문서를_등록하면_챗봇과_문서에_대해_대화할_수_있습니다')}
                  divClassName={`flex items-center justify-between w-52 text-secondary-dark`}
                >
                  {isRagModelCreating ? (
                    <button
                      className="flex items-center justify-center w-32 h-12 bg-white border rounded-lg cursor-not-allowed border-set-border"
                      onClick={(e) => e.preventDefault()}
                    >
                      <div className="w-4 h-4 mr-2 border-2 rounded-full spinner border-primary-darkblue border-t-transparent"></div>
                      <span className="text-primary-darkblue">{t('chatplay:등록_중')}</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-32 h-12 text-white border rounded-lg border-set-border bg-primary-darkblue"
                      onClick={handleRegisterModal}
                      disabled={isRagModelCreating}
                    >
                      {t('rag:신규_문서_등록')}
                    </button>
                  )}
                  <button
                    type="submit"
                    ref={deleteButtonRef}
                    className="w-20 h-12 ml-2 text-white border rounded-lg border-set-border bg-primary-gray"
                    onClick={handleDeleteModal}
                  >
                    {t('button:삭제')}
                  </button>
                </ContentTitle>
                <ListArea
                  deleteBtn={false}
                  count={totalCount > 0 ? totalCount : 0}
                  listCont={
                    fetchListData?.length > 0 ? (
                      <RetrievlSettingTable fetchListData={fetchListData} />
                    ) : userLoginState.userId ? (
                      <ResultNotFound firstContent={t('rag:등록된_문서가_없습니다')} />
                    ) : (
                      <NotLoginInfo />
                    )
                  } // 테이블형 목록
                />
                {fetchListData?.length > 0 && <Pagination />}
              </Suspense>
            </div>
          </ModalBody>

          <ModalChatplay
            isShow={isShowModal.isShow}
            className={`modal-template transition-transform duration-3000 ease ${
              isShowModal ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
            }`}
            onClose={closeModal}
          >
            {isShowModal.name === 'register' && (
              <ModalChatbotRegister
                onClose={closeModal}
                className={`transition-transform duration-3000 ease rounded-md ${
                  isShowModal ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                }`}
                isShowBackdrop={isShowBackdrop}
              />
            )}
            {isShowModal.name === 'delete' && <ModalConfirmDelete handleClose={closeModal} />}
          </ModalChatplay>

          {isShowModal.isShow && <div className={`bg-black/60 w-full h-full absolute top-0 left-0 z-50 `} />}
        </div>
      </div>
    </div>
  );
};

export default ModalRetreivalSetting;
