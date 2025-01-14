import { atom } from 'recoil';
import { format } from 'date-fns';

export type statisticsTabTypes = 'ai-chat' | 'chat-play' | 'chat-hub' | 'embedding-history' | 'llm-template';

const activeStatisticsTab = atom<statisticsTabTypes>({
  key: 'activeStatisticsTab',
  default: 'chat-hub',
});

export type searchDateLabelTypes = '오늘' | '이번주' | '이번달' | '기간검색';
export type searchDateValueTypes = 'DAY' | 'WEEK' | 'MONTH' | 'PERIOD';

export interface searchDateTypeProps {
  label: searchDateLabelTypes;
  value: searchDateValueTypes;
}

const searchDateType = atom<searchDateTypeProps>({
  key: 'searchDateType',
  default: {
    label: '오늘',
    value: 'DAY',
    // label: '이번주',
    // value: 'WEEK',
  },
});

const searchStartDate = atom<string>({
  key: 'searchStartDate',
  default: '',
});

const searchEndDate = atom<string>({
  key: 'searchEndDate',
  default: format(new Date(), 'yyyy-MM-dd'),
});

const isFetching = atom<boolean>({
  key: 'isFetching',
  default: false,
});

export { activeStatisticsTab, searchDateType, searchStartDate, searchEndDate, isFetching };
