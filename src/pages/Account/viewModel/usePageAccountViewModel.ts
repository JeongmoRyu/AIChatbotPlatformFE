import { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useRestfulCustomAxios } from '@/shared/hooks/useRestfulCustomAxios';
import { userAuthority as useUserAuthority } from '@/shared/store/onpromise';
import { showNotification } from '@/shared/utils/common-helper';
import { listPageCount, pagesList, pageIndex } from '@/shared/store/page-data';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { AccountWorksheetColumns, DEFAULT_USER_DATA } from '../model/usePageAccountModel';
import { useFetchFileUpload } from '@/shared/hooks/useFetchFileUpload';

const usePageAccountViewModel = () => {
  const { sendRequest } = useRestfulCustomAxios();
  const [userList, setUserList] = useState<UserListType[]>([]);
  // const [selectUserId, setSelectUserId] = useState<string | null>(null);
  const userAuthority = useRecoilValue(useUserAuthority);
  // const userLoginState = useRecoilValue(useUserLoginState);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreate, setIsCreate] = useState(true);
  const [userDetailData, setUserDetailData] = useState<UserListType | null>(DEFAULT_USER_DATA);
  // Pagination
  // const [memberDisPlayData, setMemberDisPlayData] = useState<QADetailData[]>([]);
  const [memberTotalPage, setMemberTotalPage] = useState<number>(0);
  const [totalMember, setTotalMember] = useState<number>(0);
  const [currentPage, setCurrentPage] = useRecoilState(pageIndex);
  const [pageCount, setPageCount] = useRecoilState(listPageCount);
  const [findString, setFindString] = useState<string>('');
  const [findValue, setFindValue] = useState<string>('');
  const setPages = useSetRecoilState(pagesList);
  const [, setIsLoading] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  // NotiModal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [isCloseButton, setIsCloseButton] = useState<boolean>(false);
  const [IDCheck, setIDCheck] = useState<boolean>(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  // Excelfile
  const fileUpload = useFetchFileUpload();
  const [settingExcel, setSettingExcel] = useState<FileType[]>([]);

  const handleInputChange = (e: any) => {
    setFindString(e.target.value);
  };

  const handleSaveApi = async () => {
    if (!userDetailData?.username) {
      setModalMessage('아이디는 필수값입니다.');
      setIsModalOpen(true);
      return;
    }
    if (!userDetailData?.user_key && !IDCheck) {
      setModalMessage('아이디 중복체크는 필수입니다.');
      setIsModalOpen(true);
      return;
    }
    if (!userDetailData?.name) {
      setModalMessage(`이름은 필수입니다.`);
      setIsModalOpen(true);
      return;
    }
    const method = userDetailData?.user_key ? 'put' : 'post';
    // const putData = {
    //   ...userDatileData,
    //   password: userDatileData?.password ? sha512(userDatileData?.password) : '',
    // };
    console.log(userDetailData);
    const response = await sendRequest('/login/account', method, undefined, userDetailData);
    if (response && response.data) {
      if (response.data.code === 'F000') {
        setModalMessage(`${method === 'put' ? '수정' : '생성'} 완료되었습니다.`);
        setIsModalVisible(false);
        setIsModalOpen(true);
        loadMemberData();
        // getMemberData(0);
        setCurrentPage(1);
      } else {
        setModalMessage(`정상적으로 ${method === 'put' ? '수정' : '생성'}을 실패하였습니다.`);
        setIsModalOpen(true);
      }
    } else {
      setModalMessage(`정상적으로 ${method === 'put' ? '수정' : '생성'}을 실패하였습니다.`);
      setIsModalOpen(true);
      return;
    }
  };

  const handleRoleChange = (value: string) => {
    setUserDetailData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        is_editor: value === 'Editor' || value === 'Admin' || value === 'SuperAdmin',
        is_admin: value === 'Admin' || value === 'SuperAdmin',
        is_super_admin: value === 'SuperAdmin',
      };
    });
  };

  const handleValueChange = (type: string, value: any) => {
    if (userDetailData !== null) {
      setUserDetailData((prev) => {
        if (!prev) return null;
        return { ...prev, [type]: value };
      });
    }
    console.log(userDetailData);
  };

  const handleCreateModalOpen = () => {
    setUserDetailData(DEFAULT_USER_DATA);
    setIsCreate(true);
    setIsCloseButton(false);
    setIsModalVisible(true);
  };
  const handleCreateModalClose = () => {
    setIsModalVisible(false);
  };
  const handleOpenRevise = (item: UserListType) => {
    setUserDetailData(item);
    setIsCreate(false);
    setIsCloseButton(false);
    setIsModalVisible(true);
  };

  const toggleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedUsers(userList.map((item) => item.user_key).filter((key): key is number => key !== undefined));
    } else {
      setSelectedUsers([]);
    }
  };
  const handleFindName = () => {
    setFindValue(findString);
  };

  const toggleSelectUser = (userKey: number) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userKey)) {
        return prev.filter((key) => key !== userKey);
      } else {
        return [...prev, userKey];
      }
    });
  };

  // NotiModal
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Pagination
  const itemsPerPage = 7;
  useEffect(() => {
    setCurrentPage(1);
    const fetchInitialData = async () => {
      setIsLoading(true);
      const { totalPages: memberTotalPage, totalMember: totalMember } = await getMemberData(0);
      setMemberTotalPage(memberTotalPage);
      setTotalMember(totalMember);
      setIsLoading(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    loadMemberData();
  }, [currentPage, findValue]);

  const loadMemberData = useCallback(async () => {
    try {
      const response = await getMemberData(currentPage - 1);
      const { content, totalPages, totalMember } = response;
      setUserList(content);
      setTotalMember(totalMember);
      setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageCount, findValue]);

  useEffect(() => {
    const totalPages = memberTotalPage;
    setPageCount(totalPages);
    setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
  }, [memberTotalPage, setPageCount, setPages]);

  const getMemberData = async (page: number) => {
    const params = { page, size: itemsPerPage, email: findValue };
    const response = await sendRequest(`/login/account/list-paged`, 'get', undefined, undefined, params);
    if (response && response.data) {
      const { data } = response.data;
      if (page === 0) {
        console.log(`Member Total Pages: ${data.total_pages}`);
      }
      return { totalPages: data.total_pages, content: data.content, totalMember: data.total_elements };
    } else {
      showNotification('서버로부터 정상적인 데이터를 받지 못했습니다.', 'error');
      return { totalPages: 0, content: [], totalMember: 0 };
    }
  };

  const handleIDCheck = () => {
    if (isCreate) {
      if (userDetailData && userDetailData.username) {
        checkMemberAccount(userDetailData.username);
      } else {
        setModalMessage('아이디를 입력 후 확인바랍니다.');
        setIsModalOpen(true);
      }
    } else {
      if (userDetailData && userDetailData.user_key) {
        resetMemberPW(userDetailData.user_key);
      } else {
        setModalMessage('팝업 종료 후 다시 시도 바랍니다.');
        setIsModalOpen(true);
      }
    }
  };

  useEffect(() => {
    setIDCheck(false);
  }, [userDetailData?.username]);

  const checkMemberAccount = async (email: string) => {
    const response = await sendRequest(`/login/account/chkdup/?email=${email}`, 'get', undefined, undefined, undefined);
    if (response && response.data) {
      console.log(response);
      const data = response.data;
      console.log(data);
      if (data.code === 'EA03') {
        console.log('EA03');
        setModalMessage(data.message);
        setIDCheck(true);
        setIsModalOpen(true);
      } else {
        console.log('EA02');
        setModalMessage(data.message);
        setIDCheck(false);
        setIsModalOpen(true);
      }
    } else {
      setModalMessage('ID 중복체크 확인을 실패했습니다.');
      setIsModalOpen(true);
    }
  };
  const resetMemberPW = async (userkey: number) => {
    const param = { user_key: userkey };
    const response = await sendRequest(`/login/account/resetpwd`, 'put', undefined, param, undefined);
    if (response && response.data) {
      const data = response.data;
      if (data.code === 'F000') {
        setModalMessage(data.message);
        setIsModalOpen(true);
      } else {
        setModalMessage(data.message);
        setIsModalOpen(true);
      }
    } else {
      setModalMessage('비밀번호 초기화에 실패했습니다.');
      setIsModalOpen(true);
    }
  };

  const handleDeleteApi = async () => {
    if (selectedUsers.length === 0) {
      setModalMessage('삭제하실 아이디를 선택해주십시오.');
      setIsModalOpen(true);
      return;
    }
    const param = selectedUsers;
    console.log(param);
    if (selectedUsers && selectedUsers.length !== 0) {
      const response = await sendRequest(`/login/account/deleteall`, 'delete', undefined, param, undefined);
      // const response = await sendRequest(`/login/account/${userDetailData.user_key}`, 'delete');
      if (response && response.data && response.data.code === 'F000') {
        setModalMessage(response.data.message);
        setIsModalOpen(true);
        loadMemberData();
        setCurrentPage(1);
      } else {
        setModalMessage(response.data.message);
        setIsModalOpen(true);
      }
      return;
    }
  };

  // excel file 관련
  const excelFileUpload = async () => {
    if (settingExcel.length > 0) {
      try {
        const responseData: any = await fileUpload.multiFileUpload('/login/registall', 'post', settingExcel);
        const { result, code, message } = responseData?.data;
        let trimmedMessage = message;
        if (message.length > 15) {
          trimmedMessage = `${message.slice(0, 15)}...`;
        }
        if (result === false) {
          if (code === 'UR01') {
            showNotification(`${trimmedMessage}`, 'error');
          } else if (code === 'UR02') {
            showNotification(`\n${trimmedMessage}`, 'error');
          } else if (code === 'UR03') {
            showNotification(`\n${trimmedMessage}`, 'error');
          } else {
            showNotification(`${trimmedMessage}`, 'error');
          }
        } else {
          setModalMessage('정상적으로 업로드되었습니다.');
          setIsModalOpen(true);
          loadMemberData();
          setCurrentPage(1);
        }
      } catch (err: any) {
        showNotification(`파일 업로드 중 오류가 발생했습니다: ${err.trimmedMessage}`, 'error');
      }
    } else {
      showNotification('파일을 선택하세요.', 'error');
    }
  };

  // const excelFileUpload = async () => {
  //   if (settingExcel.length > 0) {
  //     await fileUpload
  //       .multiFileUpload('/login/registall', 'post', settingExcel)
  //       .then((responseData: any) => {
  //         const { data } = responseData?.data;
  //         console.log(responseData);
  //         console.log(responseData.data);
  //         if (data && data.length > 0) {
  //           setModalMessage('정상적으로 업로드되었습니다.');
  //           setIsModalOpen(true);
  //           loadMemberData();
  //           setCurrentPage(1);
  //         }
  //       })
  //       .catch((err: any) => {
  //         showNotification(err.message, 'error');
  //       });
  //   } else {
  //     showNotification('파일을 선택하세요.', 'error');
  //   }
  // };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const convertedFiles: FileType[] = Array.from(files).map((file, index) => ({
        id: index,
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      }));
      setSettingExcel(convertedFiles);
    }
  };

  // excel 파일 다운로드
  const exportToExcel = async () => {
    const workbook = new Workbook();

    const AccountWorksheet = workbook.addWorksheet('계정 등록');
    AccountWorksheet.columns = AccountWorksheetColumns;

    const placeholderData = [
      {
        id: '필수 / 데이터는 3번 행부터 입력됩니다.',
        password: '필수 / 초기 비밀번호는 ID와 동일하게 등록하는 것이 관리하기 용이합니다.',
        name: '필수',
        authority: '필수 / User, Editor, Admin 중 선택',
      },
    ];

    placeholderData.forEach((data) => {
      const row = AccountWorksheet.addRow(data);
      row.eachCell((cell, colNumber) => {
        cell.font = { color: { argb: 'FF808080' }, italic: true };
        cell.value = Object.values(data)[colNumber - 1];
      });
    });
    for (let i = 0; i < 10000; i++) {
      AccountWorksheet.addRow({});
    }
    const authorityValidation = {
      type: 'list' as 'list',
      allowBlank: false,
      formulae: ['"User,Editor,Admin"'],
      showErrorMessage: true,
      errorTitle: '잘못된 선택',
      error: 'User, Editor, Admin 중 하나를 선택해야 합니다.',
    };
    AccountWorksheet.getColumn('authority').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      if (rowNumber > 2) {
        cell.dataValidation = authorityValidation;
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), '계정 등록 양식.xlsx');
  };

  return {
    userAuthority,
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
  };
};

export default usePageAccountViewModel;
