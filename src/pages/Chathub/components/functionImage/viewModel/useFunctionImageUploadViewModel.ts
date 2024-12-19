import { useCallback, useEffect, useState } from 'react';

interface UseFunctionImageUploadViewModelProps {
  serverImg?: string;
  onImageChange?: (imageName: string | null) => void;
}

export function useFunctionImageUploadViewModel({ serverImg, onImageChange }: UseFunctionImageUploadViewModelProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    serverImg && setImageSrc(serverImg);
  }, [serverImg]);

  useEffect(() => {
    if (!isModalVisible) {
      setTempImageSrc(null);
    }
  }, [isModalVisible]);

  const toggleModal = useCallback(() => {
    setIsModalVisible((prev) => !prev);
  }, []);

  const handleImageSelect = useCallback((selectedImageUrl: string) => {
    setTempImageSrc(selectedImageUrl);
  }, []);

  const handleSaveActions = useCallback(() => {
    setImageSrc(tempImageSrc);
    setIsModalVisible(false);
    if (onImageChange) {
      const imageName = tempImageSrc?.match(/[^/]+\.svg$/);
      onImageChange(imageName ? imageName[0] : null);
    }
  }, [tempImageSrc, onImageChange]);

  return {
    imageSrc,
    tempImageSrc,
    isModalVisible,
    toggleModal,
    handleImageSelect,
    handleSaveActions,
  };
}
