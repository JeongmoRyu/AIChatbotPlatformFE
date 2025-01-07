import React from 'react';
// import React, { useState } from 'react';
import Modal from '@/shared/components/modal/view/Modal';
// import NotiModal from './NotiModal';

interface AccountModalProps {
  isShow: boolean;
  data: UserListType;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (type: string, value: any) => void;
  isCreate?: boolean;
  onSelectChange: (value: string) => void;
  IDCheck?: boolean;
  NameCheck?: boolean;
  UsernameCheck?: boolean;
  handleIDCheck: () => void;
}

const AccountModal: React.FC<AccountModalProps> = ({
  data,
  isShow,
  onClose,
  onChange,
  onSubmit,
  isCreate,
  onSelectChange,
  IDCheck,
  NameCheck,
  UsernameCheck,
  handleIDCheck,
}) => {
  const getSelectValue = (data: UserListType) => {
    if (data.is_super_admin) return 'Admin';
    if (data.is_admin) return 'Admin';
    //   if (data.super_admin) return 'SuperAdmin';
    //   if (data.admin) return 'Admin';
    if (data.is_editor) return 'Editor';
    return 'User';
  };
  // const getSelectValue = (data) => {
  //   if (data.super_admin) return 'SuperAdmin';
  //   if (data.admin) return 'Admin';
  //   if (data.editor) return 'Editor';
  //   return 'User';
  // };

  return (
    <Modal isShow={isShow} onClose={onClose} width={500}>
      <div className="p-4">
        {isCreate ? (
          <h2 className="text-lg font-bold mb-4">계정 생성</h2>
        ) : (
          <h2 className="text-lg font-bold mb-4">계정 정보 수정</h2>
        )}
        {isCreate ? (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">*ID</label>
            <div className="flex items-center">
              <input
                type="text"
                value={data.username}
                onChange={(e) => onChange('username', e.target.value)}
                className={`w-full p-2 border rounded ${!IDCheck || !UsernameCheck ? 'border-[#ff4d4d]' : ''}`}
                placeholder="ID를 입력해주세요"
              />
              <button
                onClick={() => handleIDCheck()}
                className="ml-2 px-2 py-2 min-w-[6rem] bg-gray-200 border border-black rounded text-center"
              >
                중복체크
              </button>
            </div>
            {!IDCheck && !UsernameCheck ? (
              <p className="text-[#ff4d4d] text-sm mt-1">ID 중복체크를 해주세요.</p>
            ) : !IDCheck ? (
              <p className="text-[#ff4d4d] text-sm mt-1">ID 중복체크를 해주세요.</p>
            ) : !UsernameCheck ? (
              <p className="text-[#ff4d4d] text-sm mt-1">ID는 필수값입니다.</p>
            ) : null}{' '}
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">*ID</label>
            <div className="flex items-center">
              <input
                type="text"
                value={data.username}
                onChange={(e) => onChange('username', e.target.value)}
                className={`w-full p-2 border rounded`}
                placeholder="ID를 입력해주세요"
                disabled={true}
              />
            </div>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">비밀번호</label>
          {isCreate ? (
            <input
              type="password"
              value={data.password}
              onChange={(e) => onChange('password', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="초기 비밀번호는 아이디와 동일합니다."
              disabled={true}
            />
          ) : (
            <div className="flex items-center">
              <input
                type="password"
                value={data.password}
                onChange={(e) => onChange('password', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="********"
                disabled={true}
              />
              <button
                onClick={() => handleIDCheck()}
                className="ml-2 px-2 py-2 min-w-[6rem] bg-gray-200 border border-black rounded text-center"
              >
                초기화
              </button>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">*이름</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            // className="w-full p-2 border rounded"
            className={`w-full p-2 border rounded ${!NameCheck ? 'border-[#ff4d4d]' : ''}`}
            placeholder="이름을 입력해주세요"
          />
          {!NameCheck ? <p className="text-[#ff4d4d] text-sm mt-1">이름은 필수값입니다.</p> : null}{' '}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">*권한</label>
          <select
            value={getSelectValue(data)}
            onChange={(e) => onSelectChange(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="User">User (일반 사용자)</option>
            <option value="Editor">Editor (기본 관리자)</option>
            <option value="Admin">Admin (관리자)</option>
            {/* <option value="SuperAdmin">Super Admin (관리자)</option>           */}
            {/* <option value="User">User (일반 사용자)</option>
            <option value="Editor">Editor (기본 관리자)</option>
            <option value="Admin">Admin (관리자)</option>
            <option value="SuperAdmin">Super Admin (관리자)</option>
           */}
          </select>
        </div>
        <div className="flex justify-center mt-[2rem]">
          <button onClick={onClose} className="px-4 py-2 mr-2 btn_type middle white rounded">
            취소
          </button>
          <button onClick={onSubmit} className="px-4 py-2 btn_type middle black rounded">
            등록
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AccountModal;
