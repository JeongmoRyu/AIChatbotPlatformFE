import LinearLineChart from '@/pages/Account/components/statistics/LinearLineChart.tsx';
import DataTable from '@/pages/Account/components/statistics/DataTable.tsx';
import StackedBarChart from '@/pages/Account/components/statistics/StackedBarChart.tsx';
import tw from 'tailwind-styled-components';
import { motion } from 'framer-motion';

const chartStyle = `
  .recharts-surface:focus {
    outline: none;
  }
  
  .bg-card {
    height: auto !important;
  }
`;

interface DashboardBodyWrapProps {
  title: string;
  type: string;
  chartData: any;
  chartLabel: any;
  tableData: any;
  isOverflowY: boolean;
  count: number;
}

const DashboardContent = (props: DashboardBodyWrapProps) => {
  const { title, type, chartData, chartLabel, tableData, isOverflowY, count } = props;
  return (
    <DashboardContentWrap>
      <style>{chartStyle}</style>
      {type === 'line' && (
        <LinearLineChart title={title} data={chartData} label={chartLabel} isOverflowY={isOverflowY} count={count} />
      )}
      {type === 'bar' && (
        <StackedBarChart title={title} data={chartData} label={chartLabel} isOverflowY={isOverflowY} count={count} />
      )}
      <DataTable type={type} data={tableData} />
    </DashboardContentWrap>
  );
};

export default DashboardContent;

export const DashboardContentWrap = tw.div`
      relative
      bg-white
      rounded-lg
      p-4
      w-[630px]
      h-auto
      flex
      flex-col
      justify-start
      items-center
      gap-6
      laptop:w-[500px]
      laptop-sm:w-[630px]
      `;
