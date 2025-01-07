import ico_new_create from '@/shared/assets/images/icons/ico_new_create.svg';
import ico_editpen from '@/shared/assets/images/icons/EditPen.svg';
import ico_search from '/images/pictogram/ico_search.svg';
import AccountModal from '../components/modal/view/AccountModal';
import NotiModal from '../components/modal/view/NotiModal';
import DataSourcePagination from '@/shared/components/pagination/view/DataSourcePagination';
import ico_hover from '@/shared/assets/images/icons/ico_hover.svg';
import ico_download from '@/shared/assets/images/icons/ico_download.svg';
import ico_fileupload from '@/shared/assets/images/icons/ico_fileupload.svg';
import usePageAccountViewModel from '../viewModel/usePageAccountViewModel';

const PageAccount = () => {
  const {
    // userAuthority,
    userList,
    selectedUsers,
    toggleSelectUser,
    handleCreateModalOpen,
    handleOpenRevise,
    totalMember,
    findString,
    handleInputChange,
    handleFindName,
    toggleSelectAll,
    setIsTooltipVisible,
    isTooltipVisible,
    handleDeleteApi,
    userDetailData,
    isModalVisible,
    isCreate,
    handleValueChange,
    handleCreateModalClose,
    handleSaveApi,
    handleRoleChange,
    IDCheck,
    handleIDCheck,
    isModalOpen,
    modalMessage,
    handleModalClose,
    isCloseButton,
    exportToExcel,
    excelFileUpload,
    handleFileChange,
    NameCheck,
    usernameCheck,
  } = usePageAccountViewModel();

  const userListLayout = () => {
    if (userList.length === 0) {
      return (
        <tr>
          <td colSpan={7} className="text-center">
            데이터가 없습니다.
          </td>
        </tr>
      );
    }
    let users: UserListType[] = [];
    users = userList;

    return users.map((item, index) => {
      const id = `${item.user_key}_${item.username}`;
      const isChecked = selectedUsers.includes(item.user_key);
      return (
        <tr key={id}>
          <td className="cell_checked">
            <input
              type="checkbox"
              id={id}
              checked={isChecked}
              onChange={() => toggleSelectUser(item.user_key)}
              className="w-5 h-5 accent-black border border-black"
            />{' '}
          </td>
          <td className="cell_no">
            <label htmlFor={id}>{index + 1}</label>
          </td>
          <td className="cell_id">
            <label htmlFor={id}>{item.username}</label>
          </td>
          <td className="cell_name">
            <label htmlFor={id}>{item.name}</label>
          </td>

          <td className="cell_admin">
            <label htmlFor={id}>
              {/* {item.super_admin ? 'Admin' : item.admin ? 'Editor' : '-'} */}
              {item.is_super_admin ? 'Admin' : item.is_admin ? 'Admin' : item.is_editor ? 'Editor' : 'User'}
            </label>
          </td>
          <td className="cell_date">
            <label htmlFor={id}>{'2024-12-09'}</label>
          </td>
          <td className="cell_revise">
            {item !== null && (
              <button type="button" onClick={() => handleOpenRevise(item)}>
                <img src={ico_editpen} alt="수정" />
              </button>
            )}{' '}
          </td>
        </tr>
      );
    });
  };
  return (
    <div className="page_admin">
      <div className="admin_content">
        <p className="text-xl font-bold">계정 관리</p>
        <div className="head_warp">
          {/* <button type="button" className="btn_type black"> */}
          <button type="button" className="btn_type middle black" onClick={handleCreateModalOpen}>
            <img src={ico_new_create} alt="" />
            계정 등록
          </button>
        </div>
        <div className="flex flex-row justify-between mb-[1rem]">
          <p>
            총 {totalMember}건 / <span className="text-gray">선택 {selectedUsers.length}건</span>
          </p>
          <div>
            {' '}
            <div className="flex items-center h-[2.5rem]">
              <label htmlFor="searchId" className="mr-2">
                계정 ID
              </label>
              <input
                type="text"
                id="searchId"
                placeholder="ID를 입력해 주세요"
                className=" h-full w-[15rem] border border-[#C5CDD6]  px-2 py-1"
                value={findString}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={handleFindName}
                className="h-full w-[3rem] bg-[#C5CDD6] border border-[#C5CDD6] rounded-tr-xl rounded-br-xl flex items-center justify-center"
              >
                <img src={ico_search} alt="검색" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="table_list">
          <div className="table_list_inner">
            <table>
              <caption className="screen_hide">User List</caption>
              <colgroup>
                <col className="cell_checked" />
                <col className="cell_no" />
                <col className="cell_id" />
                <col className="cell_name" />
                <col className="cell_admin" />
                <col className="cell_date" />
                <col className="cell_revise" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" className="cell_checked">
                    <input
                      type="checkbox"
                      id="select_all"
                      checked={selectedUsers.length === userList.length}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="w-5 h-5 accent-black border border-black"
                    />
                  </th>
                  <th scope="col" className="cell_no">
                    No.
                  </th>
                  <th scope="col" className="cell_id">
                    ID
                  </th>
                  <th scope="col" className="cell_name">
                    이름
                  </th>
                  <th scope="col" className="cell_admin">
                    권한
                  </th>
                  <th scope="col" className="cell_date">
                    등록/수정일
                  </th>
                  <th scope="col" className="cell_revise_head">
                    수정
                  </th>
                </tr>
              </thead>
              <tbody>{userListLayout()}</tbody>
            </table>
          </div>
        </div>
        <div className="mt-3 mb-3">
          <div className="flex justify-between items-center">
            <div className="flex">
              <div className="relative">
                <button
                  className="flex items-center justify-center w-10 h-10"
                  onClick={() => setIsTooltipVisible(!isTooltipVisible)}
                >
                  <img src={ico_hover} alt="Info" className="w-6 h-6" />
                </button>
                {isTooltipVisible && (
                  <div>
                    <div
                      className="absolute top-[-45px] left-full translate-x-[-43px] w-[15rem] ml-2 p-2 bg-black text-white text-sm rounded shadow-lg flex items-center"
                      onClick={() => setIsTooltipVisible(false)}
                    >
                      <span className="ml-2">계정 정보를 일괄 업로드할 수 있습니다.</span>
                    </div>
                    <div className="absolute top-[-10px] left-[13px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-black"></div>
                  </div>
                )}
              </div>
              <button className="btn_type middle white" onClick={exportToExcel}>
                <img src={ico_download} alt="Download" className="w-6 h-6" />
                양식 다운로드
              </button>
              <div className="flex flex-row">
                <button className="btn_type middle white" onClick={excelFileUpload}>
                  <img src={ico_fileupload} alt="Upload" className="w-6 h-6" />
                  엑셀 업로드
                </button>
                <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} className="p-1.5" />
              </div>
            </div>
            <div>
              {/* <button className="btn_type middle white"> */}
              <button className="btn_type middle white" onClick={handleDeleteApi}>
                계정 삭제하기
              </button>
            </div>
          </div>
        </div>
        <DataSourcePagination />
      </div>
      {userDetailData && (
        <div className="fixed z-10">
          <AccountModal
            data={userDetailData}
            isShow={isModalVisible}
            isCreate={isCreate}
            onChange={handleValueChange}
            onClose={handleCreateModalClose}
            onSubmit={handleSaveApi}
            onSelectChange={handleRoleChange}
            IDCheck={IDCheck}
            NameCheck={NameCheck}
            UsernameCheck={usernameCheck}
            handleIDCheck={handleIDCheck}
          ></AccountModal>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed z-10000">
          <NotiModal
            message={modalMessage}
            onOkay={handleModalClose}
            onClose={isCloseButton ? handleModalClose : undefined}
          ></NotiModal>
        </div>
      )}
    </div>
  );
};

export default PageAccount;
