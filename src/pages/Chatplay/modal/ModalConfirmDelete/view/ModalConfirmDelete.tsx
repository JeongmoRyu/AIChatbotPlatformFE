import { useTranslation } from 'react-i18next';

import { ModalHeader } from '@/shared/components/ModalComp/view/ModalHeader';
import { ModalBody } from '@/shared/components/ModalComp/view/ModalBody';
import { ModalFooter } from '@/shared/components/ModalComp/view/ModalFooter';

import ModalConfirmDeleteViewModel from '../viewModel/ModalConfirmDeleteViewModel';

interface ModalNoticeProps {
  handleClose: () => void;
}

function ModalConfirmDelete({ handleClose }: ModalNoticeProps) {
  const { t } = useTranslation(['common']);

  const { checkList, modalNoticeState, handleDeleteModal } = ModalConfirmDeleteViewModel({ handleClose });

  return (
    <div className="flex flex-col items-center p-10">
      <ModalHeader>
        <h2 className="mr-auto text-xl font-medium">{modalNoticeState.title}</h2>
      </ModalHeader>
      <ModalBody className="">
        {checkList.length !== 0 && (
          <div className="col-span-12">
            <p className="w-full"> {t('common:정말_삭제하시겠습니까')}</p>
          </div>
        )}
        {checkList.length === 0 && (
          <div className="col-span-12">
            <p className="w-full">{t('common:선택된_항목이_없습니다')}</p>
          </div>
        )}
      </ModalBody>
      <ModalFooter className="flex items-center justify-between">
        {checkList.length !== 0 && (
          <button name="cancel" type="button" onClick={handleClose} className="w-20 mr-2 btn normal">
            {t('common:취소')}
          </button>
        )}
        <button name="confirm" type="button" className="w-20 btn primary" onClick={handleDeleteModal}>
          {t('common:확인')}
        </button>
      </ModalFooter>
    </div>
  );
}

export default ModalConfirmDelete;
