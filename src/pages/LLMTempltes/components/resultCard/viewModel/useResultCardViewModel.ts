import { useEffect, useState } from 'react';

import useCopyToClipboard from '@/pages/LLMTempltes/hooks/useCopyToClipboard';

const useResultCardViewModel = ({ createdSentence, preview }: ResultCardProps) => {
  const copyToClipboard = useCopyToClipboard();

  const [length, setLength] = useState<number>(0);
  const [byte, setByte] = useState<number>(0);

  useEffect(() => {
    setLength(calculateLength(createdSentence));
    setByte(calculateByte(createdSentence));
  }, [createdSentence]);

  const onClickCopyTitle = () => {
    const titleText = createdSentence.replace(/<[^>]*>?/gm, '');
    !preview && copyToClipboard(titleText);
  };

  const calculateLength = (text: string) => {
    return text.length;
  };

  const calculateByte = (text: string) => {
    return new Blob([text]).size;
  };

  return { length, byte, onClickCopyTitle };
};

export default useResultCardViewModel;
