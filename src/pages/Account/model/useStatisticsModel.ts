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

export const barChartInputColors = ['#90DEE9', '#CBEC7B', '#C8D8DA', '#F8AAA9', '#FFD67C'];
export const barChartOutputColors = ['#51C3D0', '#A2CD37', '#97A8AA', '#F85F5D', '#F6AB3A'];
export const lineChartTotalColors = [
  '#F6AB3A',
  '#F85F5D',
  '#97A8AA',
  '#A2CD37',
  '#51C3D0',
  '#FFD67C',
  '#F8AAA9',
  '#C8D8DA',
  '#CBEC7B',
  '#90DEE9',

  // '#d82626',
  // '#d89126',
  // '#b5d826',
  // '#49d826',
  // '#26d86d',
  // '#26d8d8',
  // '#266dd8',
  // '#4926d8',
  // '#b526d8',
  // '#d82691',
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
        if (!value.includes('-')) {
          if (value === '0' || parseInt(value) % 3 === 0) {
            return `${value}시`;
          } else {
            return '';
          }
        }

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

export const cloneYAxis = (count: number): void => {
  setTimeout(() => {
    const yAxisGroups: NodeListOf<SVGGElement> = document.querySelectorAll('.recharts-yAxis');
    if (!yAxisGroups.length) return;
    const tempGroups: SVGGElement[] = [];

    if (yAxisGroups.length > 4) {
      yAxisGroups.forEach((group: SVGGElement, index: number) => {
        if (index % 2 === 0) tempGroups.push(group);
      });
    } else {
      tempGroups.push(...yAxisGroups);
    }

    const yAxisGroup: SVGGElement = tempGroups[count - 1];
    const clonedGroup: SVGGElement = yAxisGroup.cloneNode(true) as SVGGElement;
    const containerSvg: HTMLElement | null = document.getElementById(`clonedSvg_${count}`);
    if (!containerSvg) return;

    containerSvg.innerHTML = '';
    containerSvg?.appendChild(clonedGroup);
  }, 750);
};
