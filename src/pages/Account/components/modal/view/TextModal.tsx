import React, { useState } from 'react';
import Modal from '@/shared/components/modal/view/Modal';

interface TextModalProps {
  isShow: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

const TextModal: React.FC<TextModalProps> = ({ isShow, onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue('');
    onClose();
  };
  return (
    <Modal isShow={isShow} onClose={onClose} width={500}>
      <div className="p-2">
        <h2 className="text-center text-lg font-bold mb-4">답변에 대한 의견을 남겨주세요</h2>

        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="여러분의 생각이 궁금합니다 :)"
          className="w-full h-32 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-[#DDDDDD] rounded-md hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
          >
            등록
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TextModal;
