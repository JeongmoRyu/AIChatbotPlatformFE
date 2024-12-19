import { InputHTMLAttributes } from 'react';
import { useQuestionImageUploadViewModel } from '../viewModel/useQuestionImageUploadViewModel';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  onChangeImage: (imageFile: FileType) => void;
  serverImg?: string;
}

export default function QuestionImageUpload({ onChangeImage, serverImg }: Props) {
  const { inputRef, imageSrc, onUploadImage, onUploadImageButtonClick } = useQuestionImageUploadViewModel({
    onChangeImage,
    serverImg,
  });

  return (
    <div className="image_upload_wrap">
      <input type="file" accept="image/*" name="thumbnail" ref={inputRef} onChange={onUploadImage} />

      <button
        type="button"
        onClick={onUploadImageButtonClick}
        className={`img_box img_round_square ${!imageSrc ? 'img_none' : ''}`}
      >
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
}
