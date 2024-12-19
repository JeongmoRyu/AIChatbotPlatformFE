import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  userLoginState as useUserLoginState,
  userAuthority as useUserAuthority,
  chatbotIdState as useChatbotIdState,
} from '@/shared/store/onpromise';
import { connectionInfoState as useConnectionInfoStore } from '@/shared/store/userinfo';
import { showNotification } from '@/shared/utils/common-helper';
import { useRestfulCustomAxios } from '@/shared/hooks/useRestfulCustomAxios';

const usePageChathubViewModel = () => {
  const navigate = useNavigate();
  const userLoginState = useRecoilValue(useUserLoginState);
  // const setChatbotIdState = useSetRecoilState(useChatbotIdState);
  const setChatbotIdState = useSetRecoilState(useChatbotIdState);
  const [chatbotItemState, setChatbotItemState] = useState<CardChatbotType>({} as CardChatbotType);
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);
  const userAuthority = useRecoilValue(useUserAuthority);
  const [chatbotList, setChatbotList] = useState<CardChatbotType[]>([]);
  const [allChatbotList, setAllChatbotList] = useState<CardChatbotType[]>([]);
  const [functionList, setFunctionList] = useState<FunctionsType[]>([]);
  const [allFunctionList, setAllFunctionList] = useState<FunctionsType[]>([]);
  const [embeddingChatbotIdList, setEmbeddingChatbotIdList] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [toggleState, setToggleState] = useState([false, false]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { sendRequest } = useRestfulCustomAxios();
  useEffect(() => {
    getChatbotInfo();
    getFunctions();
  }, [connectionInfoState]);

  useEffect(() => {
    if (embeddingChatbotIdList.length > 0 && chatbotList.length === allChatbotList.length) {
      timerRef.current = setInterval(embeddingRefresh, 5000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [embeddingChatbotIdList, chatbotList]);

  const embeddingRefresh = async () => {
    const params = { chatbot_id_list: embeddingChatbotIdList.toString() };
    const response = await sendRequest('/chatbotinfo/status', 'get', undefined, undefined, params);

    if (response && response.data) {
      const data = response.data.data;
      if (Array.isArray(data)) {
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
        const isEmbeddingCompleted = updateData.some((item) => item.cnt_complete + item.cnt_error === item.total_count);
        console.log('**********embedding check**************', isEmbeddingCompleted);

        if (isEmbeddingCompleted && timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;

          await getChatbotInfo();
        }
      }
    } else {
      showNotification('서버로부터 정상적인 데이터를 받지 못했습니다.', 'error');
      return;
    }
  };

  const getChatbotInfo = async (): Promise<CardChatbotType[]> => {
    const response = await sendRequest('/chatbotinfo', 'get');
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        const { data } = response.data;
        if (data && data.length > 0) {
          const tempData: CardChatbotType[] = data.map((item: CardChatbotType) => ({
            id: item.id,
            name: item.name,
            image: `${connectionInfoState.chathub.restful}/chatbotinfo/image/${item.id}`,
            embedding_status: item.embedding_status,
            user_key: item.user_key,
            user_id: item.user_id,
            user_name: item.user_name,
            updated_at: item.updated_at,
          }));
          setChatbotList(tempData);
          setAllChatbotList(tempData);

          setEmbeddingChatbotIdList(
            tempData.filter((item) => item.embedding_status === 'P' && item).map((item) => item.id),
          );
        }
      } else {
        showNotification(response.data.message, 'error');
      }
    } else {
      showNotification('서버로부터 정상적인 챗봇 정보를 받지 못했습니다.', 'error');
    }
    return [];
  };

  const getFunctions = async () => {
    const response = await sendRequest('/function', 'get');
    if (response && response.data) {
      const { data } = response.data;
      if (data && data.length > 0) {
        setFunctionList(data);
        setAllFunctionList(data);
      }
    } else {
      showNotification('서버로부터 정상적인 Function 정보를 받지 못했습니다.', 'error');
      return;
    }
  };

  // const handleCreateBuilder = () => navigate('/chat-hub');
  const handleCreateBuilder = () => navigate('/chatbuilder');
  const handleChatbotClick = (chatbot_id: number) => setChatbotIdState(chatbot_id);
  // const handleCreateFunctions = () => navigate('/chat-hub');
  const handleCreateFunctions = () => navigate('/function');

  const handleToggleIsMine = useCallback(
    (type: 'chatbot' | 'functions', value: boolean) => {
      if (type === 'chatbot') {
        setToggleState([value, toggleState[1]]);
        if (value) {
          setChatbotList(chatbotList.filter((item) => item.user_key === userLoginState.user_key && item));
        } else {
          setChatbotList(allChatbotList);
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        }
      }

      if (type === 'functions') {
        setToggleState([toggleState[0], value]);
        if (value) {
          setFunctionList(functionList.filter((item) => item.user_key === userLoginState.user_key && item));
        } else {
          setFunctionList(allFunctionList);
        }
      }
    },
    [chatbotList, functionList, toggleState],
  );

  // modal
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleChatbotDeleteAPI = async () => {
    if (!chatbotItemState) {
      return false;
    }
    const index = chatbotItemState.id;
    console.log(index);
    if (!index) {
      return false;
    }
    const response = await sendRequest(`/chatbotinfo/${index}`, 'delete', undefined);
    if (response && response.data) {
      if (response.data.code === 'EA01') {
        showNotification('삭제 권한이 없습니다.', 'error');
        setIsModalVisible(false);
        return false;
      }
      if (response.data.code !== 'F002' && response.data.result !== false) {
        showNotification('정상적으로 삭제되었습니다.', 'success');
        return true;
      } else {
        showNotification('정상적으로 챗봇을 삭제하지 못하였습니다.', 'error');
        return false;
      }
    } else {
      showNotification('정상적으로 챗봇을 삭제하지 못하였습니다.', 'error');
      return false;
    }
  };

  const handleModalSave = async () => {
    const deleteSuccess = await handleChatbotDeleteAPI();

    if (deleteSuccess) {
      setIsModalVisible(false);
      setTimeout(() => {
        // window.location.reload(); 새로고침하면 시각적인 불편함이 심해 chatbotinfo를 호출
        getChatbotInfo();
        setToggleState([false, toggleState[1]]);
      }, 1000);
    }
  };
  return {
    userAuthority,
    setChatbotItemState,
    chatbotItemState,
    isModalVisible,
    handleToggleIsMine,
    toggleState,
    setToggleState,
    handleCreateBuilder,
    chatbotList,
    handleChatbotClick,
    getChatbotInfo,
    setIsModalVisible,
    handleCreateFunctions,
    functionList,
    handleModalClose,
    handleModalSave,
    connectionInfoState,
  };
};

export default usePageChathubViewModel;
