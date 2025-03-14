import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userLoginState as useUserLoginState, userAuthority as useUserAuthority } from '@/shared/store/onpromise';
import ico_pen from '@/shared/assets/images/icons/ico_pen.svg';
import PasswordModal from '../components/modal/view/PasswordModal';
import { showNotification } from '@/shared/utils/common-helper';
import { useRestfulCustomAxios } from '@/shared/hooks/useRestfulCustomAxios';
import { sha512 } from 'js-sha512';

const PageMyPage = () => {
  const { sendRequest } = useRestfulCustomAxios();
  const [userLoginState] = useRecoilState(useUserLoginState);
  const [name, setName] = useState('기본사용자');
  const [isEditing, setIsEditing] = useState(false);
  const userAuthority = useRecoilValue(useUserAuthority);

  useEffect(() => {
    console.log(userLoginState);
    setName(userLoginState.name);
  }, []);
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  // Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  // Change Name
  const handleSaveChangeName = (changedName: string) => {
    handleSaveApi(changedName);
    setIsEditing(!isEditing);
  };

  const handleSaveApi = async (text: string) => {
    if (!text) {
      showNotification('이름은 필수값입니다.', 'error');
      return;
    }
    let requestBody = {
      name: text,
    };
    const response = await sendRequest('/account/change', 'put', undefined, requestBody);
    if (response && response.data) {
      if (response.data.code === 'F000') {
        showNotification('정상적으로 수정되었습니다.', 'success');
      } else {
        showNotification(`${response.data.message}`, 'error');
      }
    } else {
      showNotification(`${response.data.message}`, 'error');
      return;
    }
  };

  const handleChangePassword = async (password: string, new_password: string) => {
    let requestBody = {
      password: sha512(password),
      new_password: sha512(new_password),
    };
    const response = await sendRequest('/account/change/password', 'put', undefined, requestBody);
    if (response && response.data) {
      if (response.data.code === 'F000') {
        showNotification('정상적으로 수정되었습니다.', 'success');
        setIsModalVisible(false);
      } else {
        showNotification(`${response.data.message}`, 'error');
      }
    } else {
      showNotification(`${response.data.message}`, 'error');
      return;
    }
  };

  return (
    <div className="py-20 px-60">
      <h1 className="text-2xl font-bold mb-10">마이페이지</h1>
      <div className="flex flex-row mb-4 items-center">
        <label className="block text-gray-700 w-32">ID</label>
        <div className="flex-grow">{userLoginState.email}</div>
      </div>
      <div className="flex flex-row mb-4 items-center">
        <label className="block text-gray-700 w-32">비밀번호</label>
        <button className="btn_type middle white" onClick={handleOpenModal}>
          비밀번호 변경
        </button>
      </div>
      <div className="flex flex-row mb-4 items-center">
        <label className="block text-gray-700 w-32">이름</label>
        <div className="flex-grow flex items-center">
          {isEditing ? (
            <div className="flex flex-row">
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                className="bg-white rounded-md border border-[#d0d9e3] p-2"
              />
              <button onClick={() => handleSaveChangeName(name)} className="ml-2 btn_type middle white">
                저장
              </button>
            </div>
          ) : (
            <div className="flex flex-row bg-white rounded-md border border-[#d0d9e3] p-2">
              <div className="flex w-[12rem] justify-start">{name}</div>
              <button onClick={toggleEditing} className="ml-2">
                <div className="rounded-md w-6 h-6 flex items-center justify-center bg-[#f2f5f9]">
                  <img src={ico_pen} alt="Edit" className="w-4 h-4 cursor-pointer" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row mb-4 items-start">
        <label className="block text-gray-700 w-32">권한</label>
        <div className="flex-grow">{userAuthority}</div>
      </div>
      <PasswordModal isShow={isModalVisible} onClose={handleModalClose} onSubmit={handleChangePassword}></PasswordModal>
    </div>
  );
};

export default PageMyPage;
