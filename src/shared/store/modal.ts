import { atom } from 'recoil';

interface ModalType {
  type: string;
  isShow: boolean;
  data: object;
}

interface ModalNoticeType {
  title: string;
  message: string;
}

const modalState = atom<ModalType>({
  key: 'modalState',
  default: {
    type: '',
    isShow: false,
    data: {},
  },
});

const modalType = atom<string>({
  key: 'modalType',
  default: '',
});

const isShowModal = atom<boolean>({
  key: 'isShowModal',
  default: false,
});

const modalNoticeState = atom<ModalNoticeType>({
  key: 'modalNoticeState',
  default: {
    title: '',
    message: '',
  },
});

export { modalState, modalNoticeState, modalType, isShowModal };
