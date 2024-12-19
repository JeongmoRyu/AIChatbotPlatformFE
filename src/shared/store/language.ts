import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

const language = atom<string | undefined>({
  key: 'language',
  default: 'ko',
  // default: 'en',
  effects_UNSTABLE: [persistAtom],
});

export { language };
