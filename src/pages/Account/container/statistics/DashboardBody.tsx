import DashboardContent from '@/pages/Account/container/statistics/DashboardContent.tsx';
import tw from 'tailwind-styled-components';

interface DashboardBodyProps {
  responseData: any;
}

const DashboardBody = (props: DashboardBodyProps) => {
  return (
    <DashboardBodyWrap>
      {props.responseData.llmApiRequest.chartData.length && props.responseData.llmApiRequest.tableData.length ? (
        <DashboardContent
          title="LLM - API Request"
          type="line"
          chartData={props.responseData.llmApiRequest.chartData}
          chartLabel={props.responseData.llmApiRequest.chartLabel}
          tableData={props.responseData.llmApiRequest.tableData}
        />
      ) : null}

      {props.responseData.llmToken.chartData.length && props.responseData.llmToken.tableData.length ? (
        <DashboardContent
          title="LLM - Tokens"
          type="bar"
          chartData={props.responseData.llmToken.chartData}
          chartLabel={props.responseData.llmToken.chartLabel}
          tableData={props.responseData.llmToken.tableData}
        />
      ) : null}

      {props.responseData.embedApiRequest.chartData.length && props.responseData.embedApiRequest.tableData.length ? (
        <DashboardContent
          title="Embedding - API Request"
          type="line"
          chartData={props.responseData.embedApiRequest.chartData}
          chartLabel={props.responseData.embedApiRequest.chartLabel}
          tableData={props.responseData.embedApiRequest.tableData}
        />
      ) : null}

      {props.responseData.embedToken.chartData.length && props.responseData.embedToken.tableData.length ? (
        <DashboardContent
          title="Embedding - Tokens"
          type="bar"
          chartData={props.responseData.embedToken.chartData}
          chartLabel={props.responseData.embedToken.chartLabel}
          tableData={props.responseData.embedToken.tableData}
        />
      ) : null}
    </DashboardBodyWrap>
  );
};

export default DashboardBody;

export const DashboardBodyWrap = tw.div`
    w-full 
    h-auto
    rounded-lg 
    grid 
    grid-cols-2 
    grid-rows-2 
    gap-x-[6.25rem] 
    gap-y-6
    place-items-center
    laptop-sm:grid-cols-1
    laptop-sm:grid-rows-4
`;
