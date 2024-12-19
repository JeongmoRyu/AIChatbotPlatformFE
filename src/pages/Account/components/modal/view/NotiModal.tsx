import React from 'react';

interface NotiModalProps {
  message: string;
  onClose?: () => void;
  onOkay: () => void;
}

const NotiModal: React.FC<NotiModalProps> = ({ message, onClose, onOkay }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-center text-lg font-bold mb-4">알림</h2>
        <p className="text-center mb-6">{message}</p>
        {onClose && (
          <button onClick={onClose} className="block mx-auto bg-black text-white py-2 px-4 rounded">
            취소
          </button>
        )}
        <button onClick={onOkay} className="block mx-auto bg-black text-white py-2 px-4 rounded">
          확인
        </button>
      </div>
    </div>
  );
};

export default NotiModal;
