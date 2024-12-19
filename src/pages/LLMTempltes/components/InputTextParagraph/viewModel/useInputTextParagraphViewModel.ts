import React, { useEffect, useState } from 'react';

const useInputTextParagraphViewModel = ({
  content,
  limitNum,
  setContent,
  setValue,
  registerName,
}: InputTextParagraphProps) => {
  const [length, setLength] = useState<number>(0);
  const [byte, setByte] = useState<number>(0);

  useEffect(() => {
    if (content) {
      const byteCount = calculateBytes(content as string);
      setByte(byteCount);
      setLength(content.length);
    }
  }, [content]);

  const handleOnchangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleCheckLength(e);
    limitNum && limitTextLengthFunc(e, limitNum - 1);

    if (setContent) {
      setContent(e.target.value); //textarea 상태 업데이트
    }
  };

  const handleOnchangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleCheckLength(e);
    limitNum && limitTextLengthFunc(e, limitNum - 1);
    if (setContent) {
      setContent(e.target.value);
    }
  };

  const onClickClearContent = (e: React.MouseEvent<HTMLButtonElement>) => {
    const key: keyof LlmConferenceFormProps = registerName as keyof LlmConferenceFormProps;
    e.preventDefault();
    setByte(0);
    setValue(key, '');
    setLength(0);

    if (setContent) {
      setContent(''); //input 상태 업데이트
    }
  };

  const handleCheckLength = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setLength(target.value.length); // 길이 업데이트
  };

  const calculateBytes = (str: string) => {
    return [...str].reduce((count, char) => {
      const charCode = char.charCodeAt(0);
      return count + (charCode < 128 ? 1 : charCode < 2048 ? 2 : charCode < 55296 || charCode >= 57344 ? 3 : 4);
    }, 0);
  };

  const limitTextLengthFunc = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
    maxLength: number,
  ) => {
    const target = e.target;
    setLength(target.value.length);
    const currentLength = target.value.length;

    if (currentLength >= maxLength) {
      target.value = target.value.slice(0, maxLength);
    }
  };
  return { onClickClearContent, handleOnchangeInput, handleOnchangeTextarea, byte, length };
};

export default useInputTextParagraphViewModel;
