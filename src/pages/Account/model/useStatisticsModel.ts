import { searchDateTypeProps, searchDateValueTypes, statisticsTabTypes } from '@/shared/store/statistics.ts';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface statisticsMenuProps {
  name: string;
  route: statisticsTabTypes;
}

export const statisticsMenuList: statisticsMenuProps[] = [
  // { name: 'AI와의 대화', route: 'ai-chat' },
  // { name: '챗플레이', route: 'chat-play' },
  { name: '챗허브', route: 'chat-hub' },
  { name: 'Embedding Ranker', route: 'embedding-history' },
  // { name: 'LLM 템플릿', route: 'llm-template' },
];

export const uriInfoList: any = {
  'ai-chat': '',
  'chat-play': '',
  'chat-hub': 'chathub',
  'embedding-history': 'ranker',
  'llm-template': '',
};

export const searchDateTypeList: searchDateTypeProps[] = [
  {
    label: '오늘',
    value: 'DAY',
  },
  {
    label: '이번주',
    value: 'WEEK',
  },
  {
    label: '이번달',
    value: 'MONTH',
  },
  {
    label: '기간검색',
    value: 'PERIOD',
  },
];

export const initYAxisOptions = () => {
  return {
    tickLine: false,
    tickFormatter: (value: string) => (parseInt(value) > 1000 ? `${parseInt(value) / 1000}k` : value),
    tickCount: 3,
  };
};

export const initXAxisOptions = (
  data: any,
): Record<searchDateValueTypes, { tickLine: boolean; tickFormatter: (value: string) => string; interval: number }> => {
  return {
    DAY: {
      tickLine: true,
      tickFormatter: (value: string) => {
        if (value.includes('-')) return '';
        if (value === '0' || parseInt(value) % 3 === 0) return `${value}시`;
        return '';
      },
      interval: 0,
    },
    WEEK: {
      tickLine: true,
      tickFormatter: (value: string) => {
        if (!value.includes('-')) return '';
        return format(new Date(value), 'EEE', { locale: ko });
      },
      interval: 0,
    },
    MONTH: {
      tickLine: true,
      tickFormatter: (value: string) => {
        if (!value.includes('-')) return '';
        const date = new Date(value);
        const dd = format(date, 'dd');

        if (dd === '01' || parseInt(dd) % 5 === 0) return format(date, 'dd일 ', { locale: ko });
        return '';
      },
      interval: 0,
    },
    PERIOD: {
      tickLine: true,
      tickFormatter: (value: string) => {
        if (!value.includes('-')) return '';

        let isShow = false;
        const splitLength = data.length < 8 ? 1 : data.length < 12 ? 3 : 5;

        data.findIndex((item: any, index: number) => {
          if (item.xLabel !== value) return;
          isShow = index % splitLength === 0;
        });

        return isShow ? value : '';
      },
      interval: 0,
    },
  };
};

export const labelFormatter = (searchDateType: searchDateTypeProps) => (label: string) => {
  if (searchDateType.value === 'DAY') {
    if (label.includes('-')) return '';
    return `${format(new Date(), 'yyyy-MM-dd / EEE요일', { locale: ko })} / ${label}시`;
  } else {
    if (!label.includes('-')) return '';
    return format(new Date(label), 'yyyy-MM-dd / EEE요일', { locale: ko });
  }
};
