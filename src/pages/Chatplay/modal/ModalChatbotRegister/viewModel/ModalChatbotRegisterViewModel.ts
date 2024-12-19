import { useRecoilState, useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { showNotification } from '@/shared/utils/common-helper';

import useFetchRag from '../../ModalRetreivalSetting/model/useFetchRag';

import { gptIsModelSaveLoading, checkDuplicate as checkDuplicateState } from '@/shared/store/rag';

const ModalChatbotRegisterViewModel = ({ onClose, isShowBackdrop }: ChatPlayModalProps) => {
  const { t } = useTranslation(['rag']);

  const { getRetrieverCheck, formDataSaveRag } = useFetchRag();

  const [ragModelName, setRagModelName] = useState<string>('');

  const [checkDuplicate, setCheckDuplicate] = useRecoilState<boolean>(checkDuplicateState);
  const [duplicateCheckMessage, setDuplicateCheckMessage] = useState<string | null>(null);
  const [messageColor, setMessageColor] = useState<'red' | 'blue' | null>(null);
  const [chunkSize, setChunkSize] = useState<string | null>('300');
  const [chunkOverlap, setChunkOverlap] = useState<string | null>('150');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState<'register' | 'upload'>('register');

  const isModelSaveLoading = useRecoilValue<boolean>(gptIsModelSaveLoading);

  useEffect(() => {
    setRagModelName('');
    setChunkSize('300');
    setChunkOverlap('150');
    setCurrentStep('register');
    setDuplicateCheckMessage(null);
    setUploadFiles([]);
  }, [isShowBackdrop]);

  const handleDuplicateCheck = async () => {
    console.log('중복 확인');

    const validKoreanRegex = /^[가-힣a-zA-Z0-9\s_]+$/;

    if (!ragModelName || ragModelName.trim() === '' || !validKoreanRegex.test(ragModelName)) {
      setRagModelName('');
      setMessageColor('red');
      setDuplicateCheckMessage(t('rag:모델명은_단어로_입력할_수_있습니다'));

      return;
    }

    if (!ragModelName || ragModelName.trim() === '') return;

    await getRetrieverCheck({
      ragModelName,
      setDuplicateCheckMessage,
      setCheckDuplicate,
      setMessageColor,
      setRagModelName,
    });
  };

  const handleOnSaveClick = async () => {
    await formDataSaveRag({ ragModelName, chunkSize, chunkOverlap, uploadFiles, onClose });
  };

  const handleChunkParmas = (e: React.ChangeEvent<HTMLInputElement>, type: 'size' | 'overlap') => {
    const value = e.target.value;

    const regex = /^[0-9\s]+$/;
    if (regex.test(value)) {
      type === 'size' ? setChunkSize(value) : setChunkOverlap(value);
    } else {
      type === 'size' ? setChunkSize('') : setChunkOverlap('');
    }
  };

  const handleCheckStep = () => {
    const size = parseInt(chunkSize || '', 10);
    const overlap = parseInt(chunkOverlap || '', 10);

    if (!checkDuplicate) {
      showNotification(t('rag:모델명_중복_확인을_해주세요'), 'error');
      return;
    }

    if (!ragModelName) {
      showNotification(t('rag:모델명을_입력해주세요'), 'error');
      return;
    }

    if (!chunkSize || chunkSize.trim() === '') {
      showNotification(t('rag:ChunkSize를_입력해주세요'), 'error');
      return;
    }

    if (!chunkOverlap || chunkOverlap.trim() === '') {
      showNotification(t('rag:ChunkOverlap을_입력해주세요'), 'error');
      return;
    }

    if (isNaN(size) || size < 300 || size > 700) {
      showNotification(t('rag:ChunkSize는_300에서_700_사이의_정수여야_합니다'), 'error');
      return;
    }

    if (isNaN(overlap) || overlap < 0 || overlap > 200) {
      showNotification(t('rag:ChunkOverlap은_0에서_200_사이의_정수여야_합니다'), 'error');
      return;
    }

    setCurrentStep('upload');
  };

  const handleModelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const regex = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s_]*$/;

    if (regex.test(value)) {
      setRagModelName(value);
    } else {
      showNotification(t('rag:모델명은_한글_알파벳_숫자_공백만_허용됩니다'), 'error');
    }

    if (checkDuplicate) {
      setCheckDuplicate(false);
      setDuplicateCheckMessage(null);
    }
  };

  const handleOnCancel = () => {
    onClose();
    setCheckDuplicate(false);
  };

  return {
    currentStep,
    ragModelName,
    handleModelNameChange,
    handleDuplicateCheck,
    duplicateCheckMessage,
    messageColor,
    handleChunkParmas,
    handleCheckStep,
    isModelSaveLoading,
    uploadFiles,
    setUploadFiles,
    setCurrentStep,
    handleOnSaveClick,
    chunkSize,
    checkDuplicate,
    chunkOverlap,
    setCheckDuplicate,
    handleOnCancel,
  };
};

export default ModalChatbotRegisterViewModel;
