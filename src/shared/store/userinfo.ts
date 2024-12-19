import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const sessionStorage = typeof window !== 'undefined' ? window.sessionStorage : undefined;
const { persistAtom } = recoilPersist({
  key: 'amore-sessionStorage',
  storage: sessionStorage,
});

interface UserInfoProps {
  session_id: string;
  user_id: string;
  user_locale: string;
}

interface ConnectionInfoProps {
  restful: string;
  socket: string;
}
interface ConnectionsInfoInfoProps {
  chathub: ConnectionInfoProps;
  chatplay: ConnectionInfoProps;
  llm: ConnectionInfoProps;
  aichat: ConnectionInfoProps;
}

const userInfoState = atom<UserInfoProps>({
  key: 'userInfoState',
  default: {
    session_id: '',
    user_id: '',
    user_locale: '',
  },
  effects_UNSTABLE: [persistAtom],
});

const connectionInfoState = atom<ConnectionsInfoInfoProps>({
  key: 'connectionInfoState',
  default: {
    chathub: {
      restful: '',
      socket: '',
    },
    chatplay: {
      restful: '',
      socket: '',
    },
    llm: {
      restful: '',
      socket: '',
    },
    aichat: {
      restful: '',
      socket: '',
    },
  },
  effects_UNSTABLE: [persistAtom],
});

export { userInfoState, connectionInfoState };
