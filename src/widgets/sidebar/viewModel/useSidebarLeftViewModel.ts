import { useState, useCallback, useMemo, useLayoutEffect, useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  chatbotIdState as useChatbotIdState,
  userLoginState as useUserLoginState,
  isChatbotImageRefresh as useIsChatbotImageRefresh,
  isLoadingState as useIsLoadingState,
} from '@/shared/store/onpromise';
import { showNotification } from '@/shared/utils/common-helper';
import { useNavigate } from 'react-router-dom';
import { useRestfulCustomAxios } from '@/shared/hooks/useRestfulCustomAxios';
import { useFetchFileUpload } from '@/shared/hooks/useFetchFileUpload';

const useSidebarLeftViewModel = () => {
  const navigate = useNavigate();
  const { sendRequest } = useRestfulCustomAxios();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const userLoginState = useRecoilValue(useUserLoginState);
  const setIsChatbotImageRefresh = useSetRecoilState(useIsChatbotImageRefresh);
  const setIsLoadingState = useSetRecoilState(useIsLoadingState);
  const [smallSidebarOpen, setSmallSidebarOpen] = useState(false);
  const [largeSidebarOpen, setLargeSidebarOpen] = useState(false);
  const [chatbotList, setChatbotList] = useState<ChatbotType[]>([]);
  const chatbotId = useRecoilValue(useChatbotIdState);
  const [settingData, setSettingData] = useState<IChatbotDataItem>({} as IChatbotDataItem);
  const [settingImage, setSettingImage] = useState<FileType[]>([]);
  const imageFileUpload = useFetchFileUpload();

  const getChatbotDetail = useCallback(async () => {
    const response = await sendRequest(`/chatbotinfo/${chatbotId}`, 'get');
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        const data = response.data.data;
        setSettingData(data);
      } else {
        showNotification(response.data.message, 'error');
        navigate('/login');
      }
    } else {
      showNotification('챗봇 관련 정보 획득에 오류가 발생하였습니다', 'error');
    }
  }, [chatbotId]);

  const toggleSidebar = useCallback(() => {
    if (!smallSidebarOpen && !largeSidebarOpen) {
      setSmallSidebarOpen(true);
    } else if (smallSidebarOpen && !largeSidebarOpen) {
      setLargeSidebarOpen(true);
    } else {
      setLargeSidebarOpen(false);
      setSmallSidebarOpen(false);
    }
  }, [smallSidebarOpen, largeSidebarOpen]);

  useLayoutEffect(() => {
    getChatbotDetail();
  }, [getChatbotDetail]);

  useEffect(() => {
    console.log(chatbotList);
    if (chatbotList.length > 0) {
      timerRef.current = setInterval(embeddingRefresh, 5000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [chatbotList]);

  const embeddingRefresh = async () => {
    console.log(chatbotList);
    const params = { chatbot_id_list: chatbotId };
    // const params = { chatbot_id_list: '14' };
    const response = await sendRequest(`/chatbotinfo/status`, 'get', undefined, undefined, params);

    if (response && response.data) {
      const data = response.data.data;

      const updateData = chatbotList.map((item) => {
        const matchedItem = data.find((v: ChatStatusType) => v.chatbot_id === item.id);
        return matchedItem
          ? {
              ...item,
              cnt_complete: matchedItem.cnt_complete,
              cnt_error: matchedItem.cnt_error,
              cnt_wait: matchedItem.cnt_wait,
              total_count: matchedItem.total_count,
            }
          : item;
      });
      setChatbotList(updateData);
    } else {
      showNotification('서버로부터 정상적인 데이터를 받지 못했습니다.', 'error');
      return;
    }
  };

  const closeSidebars = useCallback(() => {
    setSmallSidebarOpen(false);
    setLargeSidebarOpen(false);
  }, []);

  type ValueChangeChatbotDataType = keyof IChatbotDataItem;
  const onValueChange = (
    type: ValueChangeChatbotDataType | 'rag.elastic_search',
    key: string,
    value: any,
    parameters?: IEngineParameter,
  ) => {
    if (type === 'rag.elastic_search') {
      setSettingData((prev) => {
        return {
          ...prev,
          rag: {
            ...prev.rag,
            elastic_search: {
              ...prev.rag?.elastic_search,
              [key]: value,
            },
          },
        };
      });
    } else if (key === '') {
      setSettingData((prev) => ({ ...prev, [type]: value }));
    } else if (key === 'llm_engine_id' && parameters) {
      setSettingData((prev) => {
        const currentTypeValue = typeof prev[type] === 'object' && prev[type] !== null ? prev[type] : {};
        return {
          ...prev,
          [type]: {
            ...currentTypeValue,
            [key]: value,
            parameters: parameters,
          },
        };
      });
    } else if (type === 'rag' && key.startsWith('elastic_search.')) {
      const subKey = key.replace('elastic_search.', '');
      setSettingData((prev) => ({
        ...prev,
        [type]: {
          ...(prev[type] || {}),
          elastic_search: {
            ...(prev[type]?.elastic_search || {}),
            [subKey]: value,
          },
        },
      }));
    } else {
      setSettingData((prev) => {
        const currentTypeValue = typeof prev[type] === 'object' && prev[type] !== null ? prev[type] : {};
        return {
          ...prev,
          [type]: {
            ...currentTypeValue,
            [key]: value,
          },
        };
      });
    }
  };

  const putSettingDetail = async (settingData: IChatbotDataItem) => {
    const missingFields: string[] = [];
    if (!settingData.name) {
      missingFields.push('name');
    }
    if (!settingData.description) {
      missingFields.push('description');
    }
    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(', ');
      showNotification(`${missingFieldsString}은 chatbot의 필수 항목입니다.`, 'info');
      return;
    }
    const falseModes = Object.entries(modeStates)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (falseModes.length > 0) {
      const modeList = falseModes.join(', ');
      const message = `${modeList} prompt 값이 문제가 있어서 '수정할 수 없습니다.}`;
      showNotification(message, 'error');
      return;
    }

    const response = await sendRequest(`/chatbotinfo/${chatbotId}`, 'put', undefined, settingData);
    console.log(response);
    if (response && response.data) {
      if (response.data.code === 'EC02') {
        showNotification('Embedding 중입니다.', 'error');
        return false;
      }
      if (response.data.code === 'EA01') {
        showNotification('생성 권한이 없습니다.', 'error');
        return false;
      }
      if (response.data.code === 'EA04') {
        showNotification('수정 권한이 없습니다.', 'error');
        return false;
      }
      if (response.data.code !== 'F002') {
        if (response.data.result !== false) {
          const chatbotItem: ChatbotType = {
            id: settingData.id,
            name: settingData.name,
            embedding_status: settingData.embedding_status,
            image: settingData.imgfile_id,
            user_key: userLoginState.user_key,
          };

          setChatbotList([chatbotItem]);
          showNotification('정상적으로 수정되었습니다.', 'success');

          setIsChatbotImageRefresh(true);
        } else {
          showNotification('정상적으로 수정하지 못하였습니다.', 'error');
        }
      } else {
        showNotification(response.data.message, 'error');
        navigate('/login');
      }
    } else {
      showNotification('정상적으로 수정하지 못하였습니다.', 'error');
      return;
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoadingState(true);
      if (settingImage.length > 0) {
        let img_file_id: any = undefined;
        // if (settingData.imgfile_id) {
        //   img_file_id = [Number(settingData.imgfile_id)];
        // }
        await imageFileUpload
          .multiFileUpload('/file/image', 'post', settingImage)
          .then((responseData) => {
            const { data } = responseData.data;
            img_file_id = data[0].id;
          })
          .catch((err) => {
            showNotification(err.message, 'error');
          })
          .finally(async () => {
            await putSettingDetail({ ...settingData, img_file_id });
            setSettingImage([]);
          });
      } else {
        putSettingDetail(settingData);
      }

      setIsLoadingState(false);
      console.log('서버로 데이터 전송 완료');
    } catch (error) {
      console.error('데이터 전송 중 오류 발생:', error);
    }
  };
  const [modeStates, setModeStates] = useState({
    rq: true,
    rag: true,
    llm: true,
  });

  type Mode = 'rq' | 'rag' | 'llm';
  const setValueCheck = useCallback((mode: Mode, value: boolean) => {
    setModeStates((prevStates) => {
      if (prevStates[mode] !== value) {
        return { ...prevStates, [mode]: value };
      }
      return prevStates;
    });
  }, []);

  const handleChangeImage = (imageFile: FileType) => {
    setSettingImage([imageFile]);
  };

  // sidebar toggle
  const smallSidebarMotionProps = useMemo(
    () => ({
      initial: false,
      animate: smallSidebarOpen ? 'open' : 'closed',
      variants: {
        // open: { width: '3.125rem' },
        // open: { width: '18.75rem' },
        open: { width: '20rem' },
        closed: { width: 0 },
      },
      transition: { duration: 0.3 },
    }),
    [smallSidebarOpen],
  );

  const largeSidebarMotionProps = useMemo(
    () => ({
      initial: false,
      animate: largeSidebarOpen ? 'open' : 'closed',
      variants: {
        open: { width: '30rem' },
        closed: { width: 0 },
      },
      transition: { duration: 0.3 },
    }),
    [largeSidebarOpen],
  );

  return {
    smallSidebarOpen,
    largeSidebarOpen,
    toggleSidebar,
    closeSidebars,
    smallSidebarMotionProps,
    largeSidebarMotionProps,
    chatbotList,
    settingData,
    onValueChange,
    handleChangeImage,
    setValueCheck,
    handleSubmit,
  };
};

export default useSidebarLeftViewModel;
