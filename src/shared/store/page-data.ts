import { atom } from 'recoil';

const listTotalCount = atom({
  key: 'listTotalCount',
  default: 0,
});

const listPageCount = atom({
  key: 'listPageCount',
  default: 1,
});

const pagesList = atom({
  key: 'pagesList',
  default: [1],
});

const pageIndex = atom({
  key: 'pageIndex',
  default: 1,
});

interface filterProps {
  field: string | undefined;
  value: string | undefined;
}

interface periodProps {
  field: string;
  start_date: string;
  end_date: string;
}

interface orderProps {
  field: string;
  order: number;
}

export interface getListParamsProps {
  skip: number;
  limit: number;
  timezone: string;
  app_id: string;
  filter: filterProps[];
  period: periodProps;
  order: orderProps[];
}

const getListParams = atom<getListParamsProps>({
  key: 'getListParams',
  default: {
    skip: 0,
    limit: 10,
    timezone: 'Asia/Seoul',
    app_id: 'bonus_app_id',
    filter: [],
    period: {
      field: 'createdAt',
      start_date: '',
      end_date: '',
    },
    order: [
      {
        field: 'createdAt',
        order: -1,
      },
    ],
  },
});

const fetchListData = atom<any>({
  key: 'fetchListData',
  default: [],
});

const fetchRetreivalListData = atom<fetchRetreivalListDataProps[]>({
  key: 'fetchRetreivalListData',
  default: [
    {
      no: 0,
      retriever_id: 0,
      model_name: '',
      chunk_size: 0,
      chunk_overlap: 0,
      status: '',
      updated_at: '',
    },
  ],
});

export { listTotalCount, listPageCount, pagesList, pageIndex, getListParams, fetchListData, fetchRetreivalListData };
