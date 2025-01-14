import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import DashboardContent from '@/pages/Account/container/statistics/DashboardContent.tsx';
import tw from 'tailwind-styled-components';
import {
  searchDateType as useSearchDateTypeStore,
  searchDateTypeProps,
  searchEndDate as useSearchEndDateStore,
  searchStartDate as useSearchStartDateStore,
  activeStatisticsTab as useActiveStatisticsTabStore,
} from '@/shared/store/statistics.ts';
import { differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';

interface DashboardBodyProps {
  responseData: any;
}

const DashboardBody = (props: DashboardBodyProps) => {
  const activeStatisticsTab = useRecoilValue<string>(useActiveStatisticsTabStore);
  const searchDateType = useRecoilValue<searchDateTypeProps>(useSearchDateTypeStore);
  const searchStartDate = useRecoilValue<string>(useSearchStartDateStore);
  const searchEndDate = useRecoilValue<string>(useSearchEndDateStore);

  const [isOverflowY, setIsOverflowY] = useState<boolean>(false);
  const [browserWidth, setBrowserWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setBrowserWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkOverflowY = (): boolean => {
      if (browserWidth <= 1280) return true;
      if (searchDateType.value !== 'PERIOD') return false;
      if (!searchStartDate || !searchEndDate) return false;

      const diff = differenceInDays(new Date(searchEndDate), new Date(searchStartDate));
      return diff > 30;
    };

    setIsOverflowY(checkOverflowY());
  }, [browserWidth, searchDateType, searchStartDate, searchEndDate]);

  return (
    <motion.div
      key={JSON.stringify(activeStatisticsTab)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75 }}
    >
      <DashboardBodyWrap>
        {props.responseData.llmApiRequest.chartData.length && props.responseData.llmApiRequest.tableData.length ? (
          <DashboardContent
            title="LLM - API Request"
            type="line"
            chartData={props.responseData.llmApiRequest.chartData}
            chartLabel={props.responseData.llmApiRequest.chartLabel}
            tableData={props.responseData.llmApiRequest.tableData}
            isOverflowY={isOverflowY}
            count={1}
          />
        ) : null}

        {props.responseData.llmToken.chartData.length && props.responseData.llmToken.tableData.length ? (
          <DashboardContent
            title="LLM - Tokens"
            type="bar"
            chartData={props.responseData.llmToken.chartData}
            chartLabel={props.responseData.llmToken.chartLabel}
            tableData={props.responseData.llmToken.tableData}
            isOverflowY={isOverflowY}
            count={2}
          />
        ) : null}

        {props.responseData.embedApiRequest.chartData.length && props.responseData.embedApiRequest.tableData.length ? (
          <DashboardContent
            title="Embedding - API Request"
            type="line"
            chartData={props.responseData.embedApiRequest.chartData}
            chartLabel={props.responseData.embedApiRequest.chartLabel}
            tableData={props.responseData.embedApiRequest.tableData}
            isOverflowY={isOverflowY}
            count={3}
          />
        ) : null}

        {props.responseData.embedToken.chartData.length && props.responseData.embedToken.tableData.length ? (
          <DashboardContent
            title="Embedding - Tokens"
            type="bar"
            chartData={props.responseData.embedToken.chartData}
            chartLabel={props.responseData.embedToken.chartLabel}
            tableData={props.responseData.embedToken.tableData}
            isOverflowY={isOverflowY}
            count={4}
          />
        ) : null}
      </DashboardBodyWrap>
    </motion.div>
  );
};

export default DashboardBody;

export const DashboardBodyWrap = tw.div`
      w-full
      h-auto
      mb-10
      rounded-lg
      grid
      grid-cols-2
      gap-x-[6.25rem]
      gap-y-8
      laptop-sm:grid-cols-1
      laptop-sm:grid-rows-auto
      
      `;
// align-items-start
// grid-auto-rows:minmax(0, auto)
//
