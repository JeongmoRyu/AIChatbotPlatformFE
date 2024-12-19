import { ModalHeader } from '@/shared/components/ModalComp/view/ModalHeader';
import { ModalBody } from '@/shared/components/ModalComp/view/ModalBody';
import { ModalFooter } from '@/shared/components/ModalComp/view/ModalFooter';

interface ModalDeleteProps {
  id?: string | undefined;
  // isShow: boolean;
  name?: string | undefined;
  onClose: () => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function ModalChatbotDelete({ onClose, onDelete }: ModalDeleteProps) {
  return (
    <div className={` p-10`}>
      <ModalHeader>
        <h2 className="m-auto text-base font-bold ">{'챗봇 삭제'}</h2>
      </ModalHeader>
      <ModalBody className="grid grid-cols-12 gap-4 galp-y-3">
        <div className="col-span-12 font-normal text-center">
          <p>{'파일과 설정값이 영구 삭제됩니다'}</p>
          <p>{'정말로 삭제하시겠어요'}</p>
        </div>
      </ModalBody>
      <ModalFooter className="!justify-center">
        <button name="cancel" type="button" onClick={onClose} className="mr-2 btn secondary border-set-border">
          {'취소'}
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
          {'확인'}
        </button>
      </ModalFooter>
    </div>
  );
}

export default ModalChatbotDelete;
