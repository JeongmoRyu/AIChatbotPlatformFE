import Modal from '@/shared/components/modal/view/Modal';
import useModalFileUploadViewModal from '../viewModal/useModalFileUploadViewModal';
import ico_upload from '@/shared/assets/images/icons/ico_upload.svg';

interface Props {
  isShow: boolean;
  files: FileType[];
  onClose: () => void;
  onFileUpload: (files: FileType[]) => void;
  onFileRemove: (removeFileId?: number) => void;
}

function ModalFileUpload({ isShow, files, onClose, onFileUpload, onFileRemove }: Props) {
  const { handleFileChange, handleFileRemove, handleOnCancelClick, handleOnSaveClick, fileList, fileUploadRef } =
    useModalFileUploadViewModal({ files, onClose, onFileUpload, onFileRemove });

  return (
    <Modal
      isShow={isShow}
      title="파일 등록"
      onClose={onClose}
      okButtonText="Save"
      okButtonClick={handleOnSaveClick}
      okButtonDisabled={!fileList}
      cancelButtonText="Close"
      cancleButtonClick={handleOnCancelClick}
      width={430}
    >
      <p>RAG 챗봇을 구현하기 위해 파일을 등록하는 단계입니다.</p>
      <p>임베딩하기 위한 파일을 선택후 [Save] 버튼을 눌려주세요.</p>

      <div className="btn_file_wrap">
        <label htmlFor="file_upload" className="btn_file">
          <img src={ico_upload} alt="" />
          파일 업로드
          <input
            ref={fileUploadRef}
            type="file"
            multiple
            id="file_upload"
            accept=".pdf,.xls,.xlsx,.txt"
            onChange={handleFileChange}
          />
        </label>
      </div>
      <div className="file_list_box">
        {!fileList.length ? (
          <p className="txt_center">
            등록된 파일이 없습니다.
            <br />
            파일을 업로드 해주세요
          </p>
        ) : (
          <ul>
            {fileList.map((item) => (
              <li key={`file_${item.id}`}>
                {item.name}
                <button type="button" className="btn_file_delete" onClick={() => handleFileRemove(item.id)}>
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}

export default ModalFileUpload;
