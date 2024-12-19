import { useRef, useCallback, useState, useEffect } from 'react';

interface FileType {
  id: number;
  name: string;
  size: number;
  type: string;
  file: File;
}

interface UseEditImageUploadProps {
  onChangeImage: (imageFile: FileType) => void;
  serverImg?: string;
}

export const useEditImageUpload = ({ onChangeImage, serverImg }: UseEditImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (serverImg) {
      setImageSrc(serverImg);
    }
  }, [serverImg]);

  const onUploadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;
        setImageSrc(result);
      };
      reader.readAsDataURL(file);
      onChangeImage({ id: 0, name: file.name, size: file.size, type: file.type, file: file });
    },
    [onChangeImage],
  );

  const onUploadImageButtonClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  return {
    inputRef,
    imageSrc,
    onUploadImage,
    onUploadImageButtonClick,
  };
};
