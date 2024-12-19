import { atom } from 'recoil';

const gptIsRagModelCreating = atom<boolean>({
  key: 'isRagModelCreating',
  default: false,
});

const gptIsModelSaveLoading = atom<boolean>({
  key: 'gptIsModelSaveLoading',
  default: false,
});

const designListParams = atom<IDesignParams>({
  key: 'designListParams',
  default: {
    filter: 'FILTER_DESIGN_CATEGORY_ALL',
    query: null,
    start_date: null,
    end_date: null,
    limit: 10,
  },
});

const retrievalCreateRag = atom<boolean>({
  key: 'retrievalCreateRag',
  default: false,
});

interface CHECK_LIST {
  name: string;
  app_id?: string;
  notation?: string;
  service_name?: string;
  id?: string;
  title?: string;
  service_id?: string;
  service_url?: string;
  created_at?: string;
}

const checkList = atom<CHECK_LIST[]>({
  key: 'checkList',
  default: [],
});

const checkDuplicate = atom<boolean>({
  key: 'checkDuplicate',
  default: false,
});

export {
  gptIsRagModelCreating,
  checkDuplicate,
  checkList,
  retrievalCreateRag,
  gptIsModelSaveLoading,
  designListParams,
};
