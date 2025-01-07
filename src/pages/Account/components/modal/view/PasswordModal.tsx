import Modal from '@/shared/components/modal/view/Modal';
import React, { useEffect, useState } from 'react';
import ico_baneye from '@/shared/assets/images/icons/ico_baneye.svg';
import ico_eye from '@/shared/assets/images/icons/ico_eye.svg';
import { showNotification } from '@/shared/utils/common-helper';
interface PasswordModalProps {
  isShow: boolean;
  onClose: () => void;
  onSubmit: (currentPassword: string, newPassword: string) => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isShow, onClose, onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowConfirmPassword(false);
    setShowNewPassword(false);
  }, [isShow]);

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 12) {
      setError('비밀번호는 8자 이상 12자 이내입니다.');
      return;
    }
    setError('');
    onSubmit(currentPassword, newPassword);
  };

  return (
    <Modal isShow={isShow} onClose={onClose} width={500}>
      <div className="p-4 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-700">
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4">비밀번호 변경</h2>
        <div className="flex flex-row mb-4 items-center">
          <label className="block text-sm font-medium mb-1 w-40">
            현재 비밀번호<span className="text-red-500">*</span>
          </label>
          <div className="flex items-center w-full relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="현재 비밀번호를 입력해주세요"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-2 text-gray-500 hover:text-gray-700"
            >
              {showCurrentPassword ? (
                <img src={ico_eye} alt="baneye" className="w-6 h-6" />
              ) : (
                <img src={ico_baneye} alt="baneye" className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-row mb-4 items-center">
          <label className="block text-sm font-medium mb-1 w-40">
            새 비밀번호<span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col w-full">
            <div className="flex items-center w-full relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  const isValid = /^[a-zA-Z0-9]*$/.test(value);
                  if (isValid) {
                    setNewPassword(value);
                  } else {
                    showNotification('영어 대소문자와 숫자만 입력 가능합니다.', 'error');
                  }
                }}
                className={`w-full p-2 border rounded ${error ? 'border-red-500' : ''}`}
                placeholder="8-12자"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <img src={ico_eye} alt="baneye" className="w-6 h-6" />
                ) : (
                  <img src={ico_baneye} alt="baneye" className="w-6 h-6" />
                )}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>
        <div className="flex flex-row mb-4 items-center">
          <label className="block text-sm font-medium mb-1 w-40">
            비밀번호 확인<span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col w-full">
            <div className="flex items-center w-full relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  const isValid = /^[a-zA-Z0-9]*$/.test(value);
                  if (isValid) {
                    setConfirmPassword(value);
                  } else {
                    showNotification('영어 대소문자와 숫자만 입력 가능합니다.', 'error');
                  }
                }}
                className={`w-full p-2 border rounded ${error ? 'border-red-500' : ''}`}
                placeholder="8-12자"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <img src={ico_eye} alt="baneye" className="w-6 h-6" />
                ) : (
                  <img src={ico_baneye} alt="baneye" className="w-6 h-6" />
                )}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>
        <div className="flex w-full items-center justify-center">
          <button onClick={handleSubmit} className="py-2 btn_type middle black">
            비밀번호 변경
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PasswordModal;
