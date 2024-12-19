import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRestfulCustomAxios } from '@/shared/hooks/useRestfulCustomAxios';
import { showNotification } from '@/shared/utils/common-helper';
import { ICONS_LIBRARY_URL } from '@/shared/utils/pictogram';
import { useFetchFileUpload } from '@/shared/hooks/useFetchFileUpload';
import { isLoadingState as useIsLoadingState } from '@/shared/store/onpromise';
import { useRecoilState, useRecoilValue } from 'recoil';
import { connectionInfoState as useConnectionInfoStore } from '@/shared/store/userinfo';
import {
  fetchLibrary,
  fetchFunctionDetail,
  saveFunction,
  deleteFunction,
  DEFAULT_VALUE,
  DefaultFunctionsValueType,
} from '../model/usePageFunctionModel';

type ModalType = 'library' | 'delete' | 'test';

const usePageFunctionViewModel = () => {
  const { sendRequest } = useRestfulCustomAxios();
  const navigate = useNavigate();
  const location = useLocation();
  const functionId = location.state?.id || null;
  const [functionsDetail, setFunctionsDetail] = useState(DEFAULT_VALUE);
  const [libraryAllList, setLibraryAllList] = useState<LibraryItemType[]>([]);
  const [libraryChecked, setLibraryChecked] = useState<LibraryItemType[]>([]);
  const [isSave, setIsSave] = useState<boolean>(false);
  const [arrayFiles, setArrayFiles] = useState<FileType[]>([]);
  const fileUpload = useFetchFileUpload();
  const [arrRemoveFileId, setArrRemoveFileId] = useState<number[]>([]);
  const [isLoadingState, setIsLoadingState] = useRecoilState(useIsLoadingState);
  const [settingImage, setSettingImage] = useState<FileType[]>([]);
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);
  const [functionsTestReady, setFunctionsTestReady] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState({
    library: false,
    delete: false,
    test: false,
  });
  const [testMessage, setTestMessage] = useState('');
  const [testResultMessage, setTestResultMessage] = useState('');

  const getLibrary = async () => {
    setIsLoadingState(true);
    const response = await fetchLibrary(sendRequest);
    if (response && response.data) {
      const { data } = response.data;
      const tempData = data.map((item: any) => ({
        id: item.id,
        value: item.id,
        labelText: item.name,
        isChecked: false,
        description: item.description,
        img_path: `${ICONS_LIBRARY_URL}${item.img_path}`,
        link: item.link,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
      setLibraryAllList(tempData);

      if (functionId) {
        getFunctionsDetail(functionId, tempData);
      } else {
        setIsLoadingState(false);
      }
    } else {
      showNotification('서버로부터 정상적인 데이터를 받지 못했습니다.', 'error');
      setIsLoadingState(false);
    }
  };

  useEffect(() => {
    getLibrary();
    return () => {
      isLoadingState && setIsLoadingState(false);
    };
  }, []);

  useEffect(() => {
    if (libraryAllList.length > 0) {
      setLibraryChecked(libraryAllList.filter((item) => item.isChecked && item));
    }
  }, [functionsDetail.pre_info_type]);

  const getFunctionsDetail = async (id: number, allList?: LibraryItemType[]) => {
    const response = await fetchFunctionDetail(sendRequest, id);
    if (response && response.data) {
      const { data } = response.data;
      setFunctionsDetail(data);
      updatedAllList(data.pre_info_type, allList);

      const tempFileList = data.file_list.map((item: any, index: number) => ({ ...item, index }));
      setArrayFiles(tempFileList);
      setIsLoadingState(false);
    } else {
      showNotification('서버로부터 정상적인 Function 정보를 받지 못했습니다.', 'error');
      setIsLoadingState(false);
    }
  };

  const updatedAllList = (data: number[], allList?: LibraryItemType[]) => {
    const list = allList ? allList : libraryAllList;
    if (list.length > 0) {
      const updatedList = list.map((item) => {
        const isCheckedItem = data.some((checkedItem) => checkedItem === Number(item.id));
        return {
          ...item,
          isChecked: !!isCheckedItem,
        };
      });
      setLibraryAllList(updatedList);
    }
  };

  const handleBack = () => navigate(-1);

  const handleFunctionsSave = async () => {
    const missingFields: string[] = [];
    if (!functionsDetail.name) {
      missingFields.push('name');
    }
    if (!functionsDetail.description) {
      missingFields.push('description');
    }
    if (arrayFiles.length === 0) {
      missingFields.push('파일');
    }
    if (!functionsDetail.img_path) {
      missingFields.push('이미지');
    }
    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(', ');
      showNotification(`${missingFieldsString}은 function의 필수 항목입니다.`, 'info');
      return;
    }
    setIsLoadingState(true);
    let img_file_id = undefined;
    if (settingImage.length > 0) {
      await fileUpload
        .multiFileUpload('/file/image', 'post', settingImage)
        .then((responseData: any) => {
          const { data } = responseData.data;
          if (data && data.length > 0) {
            img_file_id = data[0].id;
            functionsDetail.question_image = String(img_file_id);
          }
        })
        .catch((err: any) => {
          showNotification(err.message, 'error');
        });
    }

    const isModifyFile = arrayFiles.filter((item) => item.isNewFile);
    if (isModifyFile.length > 0) {
      handleFilePost();
    } else if (functionsDetail.file_list.length === arrayFiles.length) {
      handleFunctionSaveAPI(functionsDetail);
    } else {
      handleFunctionSaveAPI({ ...functionsDetail, file_list: arrayFiles });
    }

    setIsLoadingState(false);
  };

  const handleFilePost = async () => {
    let detailAddFiles;
    await fileUpload
      .multiFileUpload('/file', 'post', arrayFiles)
      .then((responseData: any) => {
        const data = responseData.data;
        if (data.code === 'F000') {
          if (arrRemoveFileId.length > 0) {
            detailAddFiles = {
              ...functionsDetail,
              file_list: [
                ...functionsDetail.file_list.filter((item) => !arrRemoveFileId.includes(item.id || 0)),
                ...data.data,
              ],
            };
          } else {
            detailAddFiles = {
              ...functionsDetail,
              file_list: [...functionsDetail.file_list, ...data.data],
            };
          }
          handleFunctionSaveAPI({ ...detailAddFiles });
        } else {
          detailAddFiles = functionsDetail;
          return showNotification(data.message, 'error');
        }
      })
      .catch((err: any) => {
        showNotification(err.message, 'error');
      });
  };

  const getFunctionsCheckAPI = async () => {
    setFunctionsTestReady(false);
    const response = await sendRequest(`/function/check/${functionId}`, 'get', undefined, undefined, {
      msg: testMessage,
    });
    if (response && response.data) {
      const data = response.data;
      if (data.code === 'F000') {
        setTestResultMessage(data.message);
        setFunctionsTestReady(true);
      }
    } else {
      setFunctionsTestReady(true);
      showNotification('서버로부터 정상적인 Function 정보를 받지 못했습니다.', 'error');
    }
  };

  const handleFunctionSaveAPI = async (detailData: DefaultFunctionsValueType) => {
    const url = functionId ? `/function/${functionId}` : '/function';
    const method = functionId ? 'put' : 'post';
    const response = await saveFunction(sendRequest, url, method, detailData);
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        if (response.data.result !== false) {
          showNotification(`정상적으로 ${functionId ? '수정' : '생성'} 되었습니다.`, 'success');

          setTimeout(() => {
            navigate('/chat-hub');
          }, 1000);
        } else {
          showNotification('서버로 정상적인 데이터를 전달하지 못했습니다.', 'error');
        }
      } else {
        showNotification(response.data.message, 'error');
        navigate('/login');
      }
    } else {
      showNotification('서버로 정상적인 데이터를 전달하지 못했습니다.', 'error');
    }
  };

  const handleFunctionChange = (key: string, value: string | number | null) => {
    if (key === 'name' && value) {
      setFunctionsDetail((prev) => ({
        ...prev,
        name: value.toString().replace(/[^a-zA-Z0-9-_]/g, ''),
      }));
    } else if (key === 'pre_info_type') {
      const tempList = libraryAllList.map((item) =>
        item.id === value ? { ...item, isChecked: !item.isChecked } : item,
      );
      setLibraryAllList(tempList);
      setIsSave(true);
    } else {
      setFunctionsDetail((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleLibraryModalSave = () => {
    const updatedParameters = {
      ...functionsDetail,
      pre_info_type: libraryAllList.filter((item) => !!item.isChecked).map((item) => item.value),
    };
    setFunctionsDetail(updatedParameters);
    setIsModalVisible({ ...isModalVisible, library: false });
    isSave && setIsSave(false);
  };

  const handleFileChange = (files: FileType[]) => setArrayFiles(files);
  const handleFileRemove = (removeFileId?: number) => {
    if (removeFileId) {
      setArrRemoveFileId((prev) => [...prev, removeFileId]);
    } else {
      setArrRemoveFileId([]);
    }
  };

  const handleModalVisible = (type: ModalType) => setIsModalVisible({ ...isModalVisible, [type]: true });

  const handleModalClose = (type: ModalType) => {
    setIsModalVisible({ ...isModalVisible, [type]: false });
    if (type === 'library') {
      isSave && updatedAllList(functionsDetail.pre_info_type);
      isSave && setIsSave(false);
    }
  };

  const handleFunctionDeleteAPI = async () => {
    if (!functionId) {
      return false;
    }
    const response = await deleteFunction(sendRequest, functionId);
    if (response && response.data) {
      if (response.data.code === 'EA01') {
        showNotification('삭제 권한이 없습니다.', 'error');
        setIsModalVisible({ ...isModalVisible, delete: false });
        return false;
      }
      if (response.data.code !== 'F002' && response.data.result !== false) {
        showNotification('정상적으로 삭제되었습니다.', 'success');
        return true;
      } else {
        showNotification('정상적으로 Function을 삭제하지 못하였습니다.', 'error');
        return false;
      }
    } else {
      showNotification('정상적으로 Function을 삭제하지 못하였습니다.', 'error');
      return false;
    }
  };

  const handleDeleteModalSave = async () => {
    const deleteSuccess = await handleFunctionDeleteAPI();

    if (deleteSuccess) {
      setIsModalVisible({ ...isModalVisible, delete: false });
      setTimeout(() => {
        navigate('/chat-hub');
      }, 1000);
    }
  };

  const handleChangeImage = (imageFile: FileType) => setSettingImage([imageFile]);

  const handleFunctionCopy = useCallback((copydata: any) => {
    navigator.clipboard
      .writeText(copydata)
      .then(() => {
        showNotification('Function 데이터가 클립보드에 복사되었습니다.', 'success');
        copydata.name = copydata.name + '-copy';
        copydata.id = null;
        navigate('/function', { state: { isCopy: true } });
        location.state.id = null;
        console.log(location.state);
        console.log(copydata);
      })
      .catch((err) => {
        showNotification(`Function 데이터 복사를 실패하였습니다. ${err}`, 'error');
      });
  }, []);

  return {
    libraryChecked,
    functionsTestReady,
    setTestMessage,
    handleBack,
    handleFunctionsSave,
    getFunctionsCheckAPI,
    handleFunctionChange,
    handleLibraryModalSave,
    handleFileChange,
    handleFileRemove,
    handleModalVisible,
    handleDeleteModalSave,
    handleChangeImage,
    handleFunctionCopy,
    functionsDetail,
    isModalVisible,
    handleModalClose,
    isSave,
    libraryAllList,
    connectionInfoState,
    testMessage,
    testResultMessage,
  };
};

export default usePageFunctionViewModel;
