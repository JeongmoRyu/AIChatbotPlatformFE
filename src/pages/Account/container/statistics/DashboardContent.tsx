import LinearLineChart from '@/pages/Account/components/statistics/LinearLineChart.tsx';
import DataTable from '@/pages/Account/components/statistics/DataTable.tsx';
import StackedBarChart from '@/pages/Account/components/statistics/StackedBarChart.tsx';
import tw from 'tailwind-styled-components';

interface DashboardBodyWrapProps {
  title: string;
  type: string;
  chartData: any;
  chartLabel: any;
  tableData: any;
}

const chartStyle = `
  .recharts-legend-wrapper {
    // position: relative !important;
    // transform: translateZ(0);
    // width: 630px !important;
    // margin-bottom: 12px;
  }
  
  .sticky-legend {
    // position: sticky;
    // top: 0;
    // left: 0;
  }
  
  .bg-card {
    height: auto !important;
    // border: 1px solid #e5e7eb;
    // border-radius: 0.5rem;
  }
`;

const DashboardContent = (props: DashboardBodyWrapProps) => {
  const { title, type, chartData, chartLabel, tableData } = props;
  return (
    <DashboardContentWrap>
      <style>{chartStyle}</style>
      {type === 'line' && <LinearLineChart title={title} data={chartData} label={chartLabel} />}
      {type === 'bar' && <StackedBarChart title={title} data={chartData} label={chartLabel} />}
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
