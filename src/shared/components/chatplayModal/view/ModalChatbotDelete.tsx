import { ModalHeader } from '@/shared/components/ModalComp/view/ModalHeader';
import { ModalBody } from '@/shared/components/ModalComp/view/ModalBody';
import { ModalFooter } from '@/shared/components/ModalComp/view/ModalFooter';
import { useTranslation } from 'react-i18next';

interface ModalDeleteProps {
  id?: string | undefined;
  // isShow: boolean;
  name?: string | undefined;
  onClose: () => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function ModalChatbotDelete({ onClose, onDelete }: ModalDeleteProps) {
  const { t } = useTranslation(['chatplay', 'button']);

  return (
    <div className={` p-10`}>
      <ModalHeader>
        <h2 className="m-auto text-base font-bold ">{t('chatplay:챗봇_삭제')}</h2>
      </ModalHeader>
      <ModalBody className="grid grid-cols-12 gap-4 galp-y-3">
        <div className="col-span-12 font-normal text-center">
          <p>{t('chatplay:파일과_설정값이_영구_삭제됩니다')}</p>
          <p>{t('chatplay:정말로_삭제하시겠어요')}</p>
        </div>
      </ModalBody>
      <ModalFooter className="!justify-center">
        <button name="cancel" type="button" onClick={onClose} className="mr-2 btn secondary border-set-border">
          {t('button:취소')}
        </button>
        <button
          name="create"
          type="button"
          className="btn primary"
          onClick={(e) => {
            onDelete(e);
            onClose();
          }}
        >
          {t('button:확인')}
        </button>
      </ModalFooter>
    </div>
  );
}

export default ModalChatbotDelete;
