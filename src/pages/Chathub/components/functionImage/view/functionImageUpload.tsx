import Modal from '@/shared/components/modal/view/Modal';
import PictogramItem from './PictogramItem';
import { ICONS_LIBRARY_URL, PICTOGRAM_IMAGES } from '@/shared/utils/pictogram';
import { useFunctionImageUploadViewModel } from '../viewModel/useFunctionImageUploadViewModel';

interface Props {
  serverImg?: string;
  onImageChange?: (imageName: string | null) => void;
}

export default function FunctionImageUpload({ serverImg, onImageChange }: Props) {
  const { imageSrc, tempImageSrc, isModalVisible, toggleModal, handleImageSelect, handleSaveActions } =
    useFunctionImageUploadViewModel({ serverImg, onImageChange });

  return (
    <div className="image_upload_wrap">
      <button type="button" onClick={toggleModal} className={`img_box img_pictogram ${!imageSrc ? 'img_none' : ''}`}>
        {imageSrc ? (
          <img className="img" src={imageSrc} alt="" />
        ) : (
          <>
            <img src="/images/ImageUpload.png" alt="" />
            <p>Upload Files</p>
            <p>*JPEG, PNG only</p>
          </>
        )}
      </button>

      <Modal
        isShow={isModalVisible}
        title="Functions Image"
        width={700}
        onClose={toggleModal}
        okButtonText="Save"
        okButtonClick={handleSaveActions}
        okButtonDisabled={!tempImageSrc}
        cancelButtonText="Close"
        cancleButtonClick={toggleModal}
      >
        <div className="wrap_round_square">
          {PICTOGRAM_IMAGES.map((item: any, index: number) => (
            <PictogramItem
              key={`function_image_${index}`}
              imageUrl={`${ICONS_LIBRARY_URL}${item}`}
              onClick={() => handleImageSelect(item)}
              isSelected={item === tempImageSrc}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}
