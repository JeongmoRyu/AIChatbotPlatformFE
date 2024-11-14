import { CONNECTING_INFO } from '@/shared/lib/data';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { connectionInfoState as useConnectionInfoStore } from '@/shared/store/userinfo';
import { useNavigate } from 'react-router-dom';
import { roomStatusState as useRoomStatusState, isLoadingState as useIsLoadingState } from '@/shared/store/onpromise';
import { modalState as useModalStore } from '@/shared/store/modal';

const useLayoutCommonViewModal = () => {
  const [connectionInfoState, setConnectionInfoState] = useRecoilState(useConnectionInfoStore);
  const navigate = useNavigate();
  const roomStatusState = useRecoilValue(useRoomStatusState);
  const isLoadingState = useRecoilValue(useIsLoadingState);
  const [modalState, setModalState] = useRecoilState(useModalStore);

  useEffect(() => {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const fullHost = window.location.hostname;
    if (hostname !== 'localhost') {
      const fullHost = port ? `${hostname}:${port}` : hostname;
      console.log(fullHost);

      if (fullHost) {
        const connectionInfo = CONNECTING_INFO[fullHost];
        setConnectionInfoState((prev) => ({
          ...prev,
          restful: connectionInfo.restful,
          socket: connectionInfo.socket,
        }));
        if (!connectionInfoState.restful) {
          navigate('/chat-hub');
        }
      }
    } else {
      if (fullHost) {
        const connectionInfo = CONNECTING_INFO[fullHost];
        setConnectionInfoState((prev) => ({
          ...prev,
          restful: connectionInfo.restful,
          socket: connectionInfo.socket,
        }));
        if (!connectionInfoState.restful) {
          navigate('/chat-hub');
        }
      }
    }
  }, []);
  return {
    roomStatusState,
    isLoadingState,
    modalState,
    setModalState,
  };
};

export default useLayoutCommonViewModal;
