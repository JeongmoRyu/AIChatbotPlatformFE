import { useCallback, useEffect, useRef, useState } from 'react';
import { useRestfulCustomAxios } from '@/shared/hooks/useRestfulCustomAxios.ts';
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns';
import {
  activeStatisticsTab as useActiveStatisticsTabStore,
  // statisticsTabTypes,
  isFetching as useIsFetchingStore,
  searchDateType as useSearchDateTypeStore,
  searchDateTypeProps,
  searchDateValueTypes,
  searchEndDate as useSearchEndDateStore,
  searchStartDate as useSearchStartDateStore,
} from '@/shared/store/statistics.ts';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { uriInfoList } from '@/pages/Account/model/useStatisticsModel.ts';

export const useStatisticsViewModel = () => {
  const { sendRequest } = useRestfulCustomAxios();

  const activeStatisticsTab = useRecoilValue<string>(useActiveStatisticsTabStore);
  const resetActiveStatisticsTab = useResetRecoilState(useActiveStatisticsTabStore);

  const [isFetching, setIsFetching] = useRecoilState<boolean>(useIsFetchingStore);

  // const [searchDateType, setSearchDateType] = useState<searchDateType>('DAY');
  const searchDateType = useRecoilValue<searchDateTypeProps>(useSearchDateTypeStore);
  const resetSearchDateType = useResetRecoilState(useSearchDateTypeStore);

  const [searchStartDate, setSearchStartDate] = useRecoilState<string>(useSearchStartDateStore);
  const [searchEndDate, setSearchEndDate] = useRecoilState<string>(useSearchEndDateStore);
  // const [isFetching, setIsFetching] = useRecoilState<boolean>(useIsFetchingStore);

  // const searchDateTypeRef = useRef<string>('');
  const searchStartDateRef = useRef<string>(format(new Date(), 'yyyy-MM-dd'));
  const searchEndDateRef = useRef<string>(format(new Date(), 'yyyy-MM-dd'));
  const paramRef = useRef<any>(null);
  const uriInfoRef = useRef<string>('');

  const responseDataFormat = { chartLabel: [], chartData: [], tableLabel: [], tableData: [] };

  // response data
  const [responseData, setResponseData] = useState<any>({
    llmApiRequest: { ...responseDataFormat },
    llmToken: { ...responseDataFormat },
    embedApiRequest: { ...responseDataFormat },
    embedToken: { ...responseDataFormat },
  });

  useEffect(() => {
    return () => {
      console.log('reset search date');
      setIsFetching(false);
      setSearchStartDate('');
      setSearchEndDate('');
      resetSearchDateType();
      resetActiveStatisticsTab();
    };
  }, []);

  useEffect(() => {
    console.log('activeStatisticsTab ::', activeStatisticsTab);

    uriInfoRef.current = uriInfoList[activeStatisticsTab];

    setIsFetching(false);
    // setSearchStartDate('');
    setSearchEndDate('');
    resetSearchDateType();
  }, [activeStatisticsTab]);

  useEffect(() => {
    if (searchDateType.value === 'PERIOD') return;

    console.log('searchDateType ::', searchDateType);

    let startDate: string = '';
    let endDate: string = '';

    switch (searchDateType.value) {
      case 'DAY':
        startDate = format(new Date(), 'yyyy-MM-dd');
        endDate = format(new Date(), 'yyyy-MM-dd');
        break;
      case 'WEEK':
        startDate = format(startOfWeek(new Date()), 'yyyy-MM-dd');
        endDate = format(endOfWeek(new Date()), 'yyyy-MM-dd');
        break;
      case 'MONTH':
        startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');
        break;
      default:
        break;
    }

    searchStartDateRef.current = startDate;
    searchEndDateRef.current = endDate;

    setSearchStartDate(startDate);
    setSearchEndDate(endDate);
  }, [searchDateType]);

  useEffect(() => {
    if (searchDateType.value !== 'PERIOD') return;
    searchStartDateRef.current = searchStartDate;
  }, [searchDateType, searchStartDate]);

  useEffect(() => {
    if (!searchEndDate) {
      setSearchEndDate(searchStartDateRef.current);
      return;
    }

    if (searchDateType.value === 'PERIOD') {
      searchEndDateRef.current = searchEndDate;
      return;
    }

    handleFetchData();
  }, [searchDateType, searchEndDate]);

  useEffect(() => {
    if (!isFetching) return;
    fetchData();
  }, [isFetching]);

  const handleResponseData = useCallback(
    (response: any) => {
      const data = response.data.data;

      setResponseData((prev: any) => ({
        ...prev,
        llmApiRequest: {
          chartData: sortChartData('line', data.llm_stats.api_request.chart_stats, searchDateType.value),
          chartLabel: createChartLabel(data.llm_stats.api_request.chart_stats),
          tableData: sortTableData('api_request', data.llm_stats.api_request.table_stats),
        },
        llmToken: {
          chartData: sortChartData('bar', data.llm_stats.tokens.chart_stats, searchDateType.value),
          chartLabel: createChartLabel(data.llm_stats.tokens.chart_stats),
          tableData: sortTableData('tokens', data.llm_stats.tokens.table_stats),
        },
        embedApiRequest: {
          chartData: sortChartData('line', data.embed_stats.api_request.chart_stats, searchDateType.value),
          chartLabel: createChartLabel(data.embed_stats.api_request.chart_stats),
          tableData: sortTableData('api_request', data.embed_stats.api_request.table_stats),
        },
        embedToken: {
          chartData: sortChartData('bar', data.embed_stats.tokens.chart_stats, searchDateType.value),
          chartLabel: createChartLabel(data.embed_stats.tokens.chart_stats),
          tableData: sortTableData('tokens', data.embed_stats.tokens.table_stats),
        },
      }));
    },
    [searchDateType],
  );

  const createChartLabel = (data: any[]) => {
    const result: any[] = [];
    data.forEach((item: any) => {
      const model = item.model.replaceAll(' ', '_').toLocaleLowerCase();
      const labelObj = {
        label: model,
        input: `${model}_input`,
        output: `${model}_output`,
        total: `${model}_total`,
      };

      result.push(labelObj);
    });
    return result;
  };

  // const getRandomValue = () => Math.floor(Math.random() * 20000) + 1000;

  const sortChartData = (type: string, data: any, searchDateTypeValue: searchDateValueTypes): any => {
    return Array.from({ length: data[0].data.length }, (_, i) => {
      return data.reduce((acc: any, item: any) => {
        const model = item.model.replaceAll(' ', '_');
        const keys = [`${model}_input`, `${model}_output`, `${model}_total`];

        acc.xLabel = searchDateTypeValue === 'DAY' ? item.data[i].hour.toString() : item.data[i].date;

        // TODO 랜덤함수 삭제
        if (type === 'bar') {
          acc[keys[0]] = item.data[i].input;
          acc[keys[1]] = item.data[i].output;

          // acc[keys[0]] = item.data[i].input || getRandomValue();
          // acc[keys[1]] = item.data[i].output || getRandomValue();
        }

        if (type === 'line') {
          acc[keys[2]] = item.data[i].total;
          // acc[keys[2]] = item.data[i].total || i % 2 === 0 ? getRandomValue() : getRandomValue();
        }

        return acc;
      }, {});
    });
  };

  const sortTableData = (type: string, data: any) => {
    let result: any = [];
    data.forEach((item: any) => {
      const model = item.model.replaceAll(' ', '_').toLocaleUpperCase();

      if (type === 'api_request') {
        result.push({
          model,
          success: item.data.success,
          failure: item.data.failure,
          total: item.data.total,
        });
      }

      if (type === 'tokens') {
        result.push({
          model,
          input: item.data.input,
          output: item.data.output,
          total: item.data.total,
        });
      }
    });

    return result;
  };

  const handleFetchData = useCallback(
    (startDate?: string, endDate?: string) => {
      if (
        searchDateType.value !== 'PERIOD' &&
        searchStartDateRef.current !== searchStartDate &&
        searchEndDateRef.current !== searchEndDate
      ) {
        return;
      }

      if (startDate && endDate) {
        setSearchStartDate(startDate);
        setSearchEndDate(endDate);
      }

      paramRef.current = {
        type: searchDateType.value,
        from_date: startDate || '',
        to_date: endDate || '',
      };

      setIsFetching(true);
      // fetchData(params);
    },
    [searchDateType, searchStartDate, searchEndDate],
  );

  const fetchData = async () => {
    const url = `/statistics/${uriInfoRef.current}`;

    console.log('params ::', paramRef.current);

    try {
      const response = await sendRequest(url, 'get', undefined, undefined, paramRef.current);
      console.log('response ::', response);

      if (response.status === 200) {
        handleResponseData(response);
      } else {
        console.error('Response Error');
        console.error(response.status);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  return {
    // searchDateType,
    // setSearchDateType,
    searchStartDate,
    setSearchStartDate,
    searchEndDate,
    setSearchEndDate,

    responseData,
    // llmApiData,
    // llmTokenData,
    // embedApiData,
    // embedTokenData,

    // embedApiRequestData,
    // embedTokenData,
    handleFetchData,
    fetchData,
  };
};
