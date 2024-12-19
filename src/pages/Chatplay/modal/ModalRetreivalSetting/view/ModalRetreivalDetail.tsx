import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { ModalBody } from '@/shared/components/ModalComp/view/ModalBody';
import { ModalHeader } from '@/shared/components/ModalComp/view/ModalHeader';

import LoadingUI from '@/shared/components/LoadingUI/view/LoadingUI';
import ContentTitle from '@/shared/components/ContentTitle/view/ContentTitle';
import ListArea from '@/shared/components/ListArea/view/ListArea';
import ResultNotFound from '@/shared/components/ResultNotFound/view/ResultNotFound';
import NotLoginInfo from '@/shared/components/NotLoginInfo/view/NotLoginInfo';

import RetrievalDetailTable from './RetrievalDetailTable';
import useModalRetreivalDetail from '../viewModel/useModalRetreivalDetail';

interface ModalRetreivalSettingProps {
  retriever_id: number;
  isShow: boolean;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  name: string;
}

const ModalRetreivalDetail = ({ retriever_id, isShow, onClose, className, name }: ModalRetreivalSettingProps) => {
  const { t, i18n } = useTranslation(['rag', 'button']);

  const { refContent, listCount, fetchDetailData, userLoginState } = useModalRetreivalDetail({ retriever_id, isShow });

  return (
    <div className={`modal !top-20 max-w-[1344px] w-full z-10 ${isShow ? 'show' : ''} ${className}`}>
      <div className="modal-dialog">
        <div className="modal-content overflow-hidden !p-0 rounded-3xl">
          <ModalHeader className="flex justify-between p-5 bg-primary-darkblue">
            <h2 className="text-lg font-bold text-white">{name}</h2>
            <button
              type="button"
              className="w-4 h-4 bg-[url(@/shared/assets/images/image/chatplay/ico_close_w.svg)] bg-no-repeat focus:shadow-none focus:outline-none max-xl:right-4"
              onClick={onClose}
            >
              <span className="sr-only">{t('button:닫기')}</span>
            </button>
          </ModalHeader>
          <ModalBody className="h-[70vh]">
            <div ref={refContent} className="h-full overflow-y-auto modal-body">
              <Suspense fallback={<LoadingUI />}>
                <section className="mt-0">
                  <div className="flex justify-start w-full">
                    <div className="contents-title !mb-0">
                      <div className="title-txt">
                        <h2>
                          <span className={`${i18n.language === 'en' ? 'mr-4' : ''}`}>{name}</span>
                          {t('rag:상세_정보')}
                        </h2>
                      </div>
                    </div>
                  </div>
                </section>
                <div className="flex items-center justify-between">
                  <ContentTitle title={t('rag:등록한_문서를_확인하고_수정할_수_있습니다')} />
                </div>

                <ListArea
                  deleteBtn={false}
                  count={listCount > 0 ? listCount : 0}
                  listCont={
                    fetchDetailData?.length > 0 ? (
                      <RetrievalDetailTable fetchDetailData={fetchDetailData} />
                    ) : userLoginState.userId ? (
                      <ResultNotFound
                        firstContent={t('rag:검색_결과가_없어요')}
                        secondContent={t('rag:다른_키워드나_기간을_재설정_해보세요')}
                      />
                    ) : (
                      <NotLoginInfo />
                    )
                  } // 테이블형 목록
                />
              </Suspense>
            </div>
          </ModalBody>
        </div>
      </div>
    </div>
  );
};

export default ModalRetreivalDetail;
