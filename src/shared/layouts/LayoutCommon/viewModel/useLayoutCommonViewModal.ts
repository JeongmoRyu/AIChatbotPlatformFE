import {
  CONNECTING_INFO,
  CONNECTING_INFO_AICHAT,
  CONNECTING_INFO_CHAT_PLAY,
  CONNECTING_INFO_LLM,
} from '@/shared/lib/data';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { connectionInfoState as useConnectionInfoStore } from '@/shared/store/userinfo';
import { useNavigate } from 'react-router-dom';
import {
  roomStatusState as useRoomStatusState,
  isLoadingState as useIsLoadingState,
  userLoginState as useUserLoginState,
} from '@/shared/store/onpromise';
import { modalState as useModalStore } from '@/shared/store/modal';
import { useRestfulCustomAxios } from '@/shared/hooks/useRestfulCustomAxios';

const useLayoutCommonViewModal = () => {
  const [connectionInfoState, setConnectionInfoState] = useRecoilState(useConnectionInfoStore);
  const userLoginState = useRecoilValue(useUserLoginState);

  const navigate = useNavigate();
  const { sendRequest } = useRestfulCustomAxios();
  const roomStatusState = useRecoilValue(useRoomStatusState);
  const isLoadingState = useRecoilValue(useIsLoadingState);
  const [modalState, setModalState] = useRecoilState(useModalStore);

  useEffect(() => {
    if (!userLoginState.accessToken) {
      navigate('/login');
    }
    const hostname = window.location.hostname;
    const port = window.location.port;
    const fullHost = window.location.hostname;
    const protocol = window.location.protocol;
    const restfulProtocol = protocol === 'https:' ? 'https' : 'http';
    const socketProtocol = protocol === 'https:' ? 'wss' : 'ws';

    if (hostname !== 'localhost') {
      const fullHost = port ? `${hostname}:${port}` : hostname;
      console.log(fullHost);

      if (fullHost) {
        const chathub = CONNECTING_INFO[fullHost] || {
          restful: `${restfulProtocol}://${hostname}:9983`,
          socket: `${restfulProtocol}://${hostname}:9984`,
        };
        const chatplay = CONNECTING_INFO_CHAT_PLAY[fullHost] || {
          restful: `${restfulProtocol}://${hostname}:9201`,
          socket: `${socketProtocol}://${hostname}:9993/chat`,
        };
        const llm = CONNECTING_INFO_LLM[fullHost] || {
          restful: `${restfulProtocol}://${hostname}:9201`,
          socket: `${socketProtocol}://${hostname}:9993/llm-task`,
        };
        const aichat = CONNECTING_INFO_AICHAT[fullHost] || {
          restful: `${restfulProtocol}://${hostname}:9201`,
          socket: `${socketProtocol}://${hostname}:9993/llm`,
        };

        console.log('restfulProtocol', restfulProtocol);
        console.log('socketProtocol', socketProtocol);

        setConnectionInfoState({
          chathub: chathub,
          chatplay: chatplay,
          llm: llm,
          aichat: aichat,
        });
        if (!connectionInfoState.chathub.restful) {
          navigate('/home');
        }
      }
    } else {
      if (fullHost) {
        const chathub = CONNECTING_INFO[fullHost] || {
          restful: `${restfulProtocol}://${hostname}:9983`,
          socket: `${restfulProtocol}://${hostname}:9984`,
        };
        const chatplay = CONNECTING_INFO_CHAT_PLAY[fullHost] || {
          restful: `${restfulProtocol}://${hostname}:9201`,
          socket: `${socketProtocol}://${hostname}:9993/chat`,
        };
        const llm = CONNECTING_INFO_LLM[fullHost] || {
          restful: `${restfulProtocol}://${hostname}:9201`,
          socket: `${socketProtocol}://${hostname}:9993/llm-task`,
        };
        const aichat = CONNECTING_INFO_AICHAT[fullHost] || {
          restful: `${restfulProtocol}://${hostname}:9201`,
          socket: `${socketProtocol}://${hostname}:9993/llm`,
        };
        setConnectionInfoState({
          chathub: chathub,
          chatplay: chatplay,
          llm: llm,
          aichat: aichat,
        });
        if (!connectionInfoState.chathub.restful) {
          navigate('/home');
        }
      }
    }
    validateToken();
  }, []);

  const validateToken = async () => {
    try {
      const response = await sendRequest('/login/token/validate', 'get');
      if (response && response.data) {
        const data = response.data;
        console.log(data);
        if (data.code === 'T01') {
          return true;
        } else {
          navigate('/login');
          return false;
        }
      } else {
        navigate('/login');
        return false;
      }
    } catch (error) {
      navigate('/login');
      return false;
    }
  };

  return {
    roomStatusState,
    isLoadingState,
    modalState,
    setModalState,
  };
};

export default useLayoutCommonViewModal;
