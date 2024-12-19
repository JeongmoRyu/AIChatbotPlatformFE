import React from 'react';
import { InputHTMLAttributes } from 'react';
import { useEditImageUpload } from '../viewModel/useEditImageUpload';

interface FileType {
  id: number;
  name: string;
  size: number;
  type: string;
  file: File;
}

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  onChangeImage: (imageFile: FileType) => void;
  serverImg?: string;
  isDisabled?: boolean;
}

const EditImageUpload: React.FC<Props> = ({ onChangeImage, serverImg }) => {
  const { inputRef, imageSrc, onUploadImage, onUploadImageButtonClick } = useEditImageUpload({
    onChangeImage,
    serverImg,
  });

  return (
    <div className="image_upload_wrap">
      <input type="file" accept="image/*" name="thumbnail" ref={inputRef} onChange={onUploadImage} />

      <button type="button" onClick={onUploadImageButtonClick} className={`img_box ${!imageSrc ? 'img_none' : ''}`}>
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
    </div>
  );
};

export default React.memo(EditImageUpload);
