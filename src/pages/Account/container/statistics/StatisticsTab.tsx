import StatisticsTabItem from '@/pages/Account/components/statistics/StatisticsTabItem';
import { statisticsMenuList } from '../../model/useStatisticsModel.ts';

const StatisticsTab = () => {
  return (
    <div className="w-full h-auto border-b border-line">
      <div className="w-full h-auto flex justify-start items-center">
        {statisticsMenuList.map((item) => (
          <StatisticsTabItem key={item.name} name={item.name} route={item.route} />
        ))}
      </div>
    </div>
  );
};

export default StatisticsTab;
