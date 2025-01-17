import { useTranslation } from 'react-i18next';

import { ModalBody } from '@/shared/components/ModalComp/view/ModalBody';
import { ModalFooter } from '@/shared/components/ModalComp/view/ModalFooter';

interface ModalNoticeProps {
  handleClose: () => void;
  message: string;
}

function ModalDuplicate({ handleClose, message }: ModalNoticeProps) {
  const { t } = useTranslation(['common']);

  return (
    <div className="flex flex-col items-center p-10">
      <ModalBody className="">
        <div className="col-span-12">
          <p className="w-full"> {message}</p>
        </div>
      </ModalBody>
      <ModalFooter className="flex items-center justify-between">
        <button name="confirm" type="button" className="w-20 btn primary" onClick={handleClose}>
          {t('common:확인')}
        </button>
      </ModalFooter>
    </div>
  );
}

export default ModalDuplicate;
