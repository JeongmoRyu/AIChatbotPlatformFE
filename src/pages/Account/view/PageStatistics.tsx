import { useEffect } from 'react';
import { useResetRecoilState } from 'recoil';

import tw from 'tailwind-styled-components';

import StatisticsTitle from '@/pages/Account/container/statistics/StatisticsTitle.tsx';
import StatisticsTab from '@/pages/Account/container/statistics/StatisticsTab.tsx';
import DashboardHeader from '@/pages/Account/container/statistics/DashboardHeader.tsx';
import DashboardBody from '@/pages/Account/container/statistics/DashboardBody.tsx';

import { activeStatisticsTab as useActiveStatisticsTabStore } from '@/shared/store/statistics.ts';
import { useStatisticsViewModel } from '@/pages/Account/viewModel/useStatisticsViewModel.ts';

const PageStatistics = () => {
  const { responseData, handleFetchData } = useStatisticsViewModel();

  const resetActiveStatisticsTab = useResetRecoilState(useActiveStatisticsTabStore);

  useEffect(() => {
    return () => resetActiveStatisticsTab();
  }, []);

  return (
    <div className="w-full h-full relative flex justify-center items-center">
      <StatisticsWrap>
        <StatisticsTitle />
        <StatisticsTab />
        <Dashboard>
          <DashboardHeader onClick={handleFetchData} />
          <DashboardBody responseData={responseData} />
        </Dashboard>
      </StatisticsWrap>
    </div>
  );
};

export default PageStatistics;

export const StatisticsWrap = tw.div`
  w-full
  h-full
  flex
  flex-col
  gap-8
  justify-start
  items-center
  py-[3.125rem]
  max-w-[85rem]
  laptop:max-w-[1100px]
  laptop-sm:max-w-[840px]
`;

export const Dashboard = tw.div`
  w-full
  h-full
  flex
  flex-col
  gap-10
  justify-start
  items-center
`;
