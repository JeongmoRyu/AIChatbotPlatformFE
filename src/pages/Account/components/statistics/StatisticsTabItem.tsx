import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useRecoilState } from 'recoil';
import { activeStatisticsTab as useActiveStatisticsTabStore, statisticsTabTypes } from '@/shared/store/statistics.ts';

interface MenuItemProps {
  name: string;
  route: statisticsTabTypes;
}

const StatisticsTabItem = (props: MenuItemProps) => {
  const { name, route } = props;
  const [activeStatisticsTab, setActiveStatisticsTab] = useRecoilState(useActiveStatisticsTabStore);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(activeStatisticsTab === route);
  }, [activeStatisticsTab, route]);

  const handleOnClick = () => setActiveStatisticsTab(route);

  return (
    <button
      className={twMerge(
        'w-auto h-9 flex justify-center items-center px-8 text-[#7B8188]',
        isActive && 'text-[#111111] border-b-2 border-[#111111]',
      )}
      onClick={handleOnClick}
    >
      {name}
    </button>
  );
};

export default StatisticsTabItem;
