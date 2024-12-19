import React, { DragEvent, useCallback, useRef, useState } from 'react';
import { isBrowser } from 'react-device-detect';
import { useTranslation } from 'react-i18next';

import { showNotification } from '@/shared/utils/common-helper';

import pdfImg from '@/shared/assets/images/image/chatplay/ico_pdf_24.svg';
import docxImg from '@/shared/assets/images/image/chatplay/ico_doc_24.svg';
import txtImg from '@/shared/assets/images/image/chatplay/ico_txt_24.svg';

import { FILE_SIZE_MAX_LIMIT } from '@/shared/lib/chatplayOptions';

const FileUploadListViewModel = ({
  uploadFiles,
  setUploadFiles,
}: {
  uploadFiles: File[];
  setUploadFiles: React.Dispatch<React.SetStateAction<File[]>>;
}) => {
  const { t } = useTranslation(['chatplay']);

  const [isPDFDrag, setIsPDFDrag] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current += 1;
    if (dragCounter.current === 1) {
      setIsPDFDrag(true);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounter.current += 1;
    if (dragCounter.current === 1) {
      setIsPDFDrag(true);
    }
  };

  const handleDragLeave = () => {
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsPDFDrag(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPDFDrag(false);
    dragCounter.current = 0;

    const droppedFiles = Array.from(e.dataTransfer.files);

    if (isBrowser && droppedFiles) {
      const validFiles = droppedFiles.filter((file) => file.size < FILE_SIZE_MAX_LIMIT);

      if (validFiles.length !== droppedFiles.length) {
        showNotification(t('rag:파일_크기는_최대_30MB까지_가능합니다'), 'error');
        return;
      }

      if (uploadFiles.length + validFiles.length > 5) {
        showNotification(t('rag:최대_5개의_파일만_첨부_가능합니다'), 'error');
        return;
      }

      const hasNonPdfFile = validFiles.some((file) => {
        if (!file.name.toLowerCase().endsWith('.pdf')) {
          showNotification(t('rag:PDF_파일만_업로드_할_수_있습니다'), 'error');
          return true;
        }
        return false;
      });

      if (hasNonPdfFile) {
        return;
      }

      const duplicateFile = validFiles.find((file) =>
        uploadFiles.some((uploadedFile) => uploadedFile.name === file.name),
      );
      if (duplicateFile) {
        showNotification(t('rag:이미_동일한_이름의_파일이_첨부되어있습니다'), 'error');
        return;
      }
      try {
        onDrop(droppedFiles);
      } catch (error) {
        console.error('Error processing file', error);
      }
    } else {
      alert(t('rag:파일_첨부는_PC환경에서만_가능합니다_PC에서_시도해주세요'));
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadFiles((prev) => {
        const updatedFiles = [...prev, ...acceptedFiles];
        return updatedFiles;
      });
    },

    [],
  );

  const handleSrc = (type: string) => {
    if (type === 'application/pdf') {
      return pdfImg;
    } else if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return docxImg;
    } else if (type === 'text/plain') {
      return txtImg;
    }
  };

  return { onDrop, isPDFDrag, handleDragEnter, handleDragLeave, handleDrop, handleDragOver, handleSrc };
};

export default FileUploadListViewModel;
