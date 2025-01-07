import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  isFetching as useIsFetchingStore,
  searchDateType as useSearchDateTypeStore,
  searchDateTypeProps,
} from '@/shared/store/statistics.ts';
import { useRecoilValue } from 'recoil';
import { Fragment, useEffect, useState } from 'react';
import { FadeLoader } from 'react-spinners';
import { initXAxisOptions, initYAxisOptions, labelFormatter } from '@/pages/Account/model/useStatisticsModel.ts';

interface StackedBarChartProps {
  title: string;
  data: any[];
  label: any[];
}

const chartColors = [
  ['#59BEC5', '#41878C'],
  ['#E48A37', '#9F5D23'],
  ['#9E74E3', '#800BE3'],
  ['#FF69B4', '#FF1493'],
  ['#FFFF00', '#FFD700'],
];

const StackedBarChart = (props: StackedBarChartProps) => {
  const { title, data, label } = props;

  const isFetching = useRecoilValue<boolean>(useIsFetchingStore);
  const searchDateType = useRecoilValue<searchDateTypeProps>(useSearchDateTypeStore);

  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  const YAxisOptions = initYAxisOptions();
  const XAxisOptions = initXAxisOptions(data);

  useEffect(() => {
    const config: ChartConfig = {};

    label.forEach((item: any) => {
      // config[item.input] = { label: item.label };
      // config[item.output] = { label: '' };
      config[item.input] = { label: item.input };
      config[item.output] = { label: item.output };
    });

    setChartConfig(config);
  }, [label]);

  const createStackedBar = () =>
    label.map((item: any, index: number) => (
      <Fragment key={item.label}>
        <Bar
          key={item.input}
          dataKey={item.input}
          stackId={item.label.toLocaleUpperCase()}
          fill={chartColors[index][0]}
          radius={[0, 0, 4, 4]}
        />
        <Bar
          key={item.output}
          dataKey={item.output}
          stackId={item.label.toLocaleUpperCase()}
          fill={chartColors[index][1]}
          radius={[4, 4, 0, 0]}
        />
      </Fragment>
    ));

  return (
    <Card className="relative w-full h-full border-none rounded-none flex flex-col items-center justify-start gap-2 shadow-none">
      <CardHeader className="p-2 w-full h-auto text-left">
        <CardTitle className="text-[1rem] font-bold leading-[19.09px]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="w-full h-auto p-0">
        <div
          className="w-full overflow-x-auto relative scrollbar-thin"
          style={
            {
              // position: 'relative',
              // overflow: 'auto',
            }
          }
        >
          {isFetching ? (
            <div className="w-full h-[330px] flex items-center justify-center">
              <FadeLoader color="#444444" speedMultiplier={1} width={5} height={17} radius={3} />
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              style={{
                minWidth: 598,
                width: data.length * ((Object.keys(data[0]).length / 2) * 17),
                height: 330,
                overflowX: 'auto',
                scrollbarWidth: 'thin',
              }}
            >
              <BarChart
                accessibilityLayer
                data={data}
                barSize={10}
                margin={{
                  left: 12,
                  right: 12,
                }}
                // className="relative"
              >
                <CartesianGrid vertical={false} horizontal={false} />
                <YAxis
                  tickLine={YAxisOptions.tickLine}
                  axisLine={true}
                  tickMargin={8}
                  tickFormatter={YAxisOptions.tickFormatter}
                  tickCount={YAxisOptions.tickCount}
                  width={30}
                  fontSize={12}
                  // style={
                  //   {
                  //     position: 'sticky',
                  //     left: 0,
                  //     zIndex: 100,
                  //   }
                  // }
                  // label={{
                  //   value: 'Y축 레이블',
                  //   angle: -90,
                  //   position: 'insideLeft',
                  //   offset: 0,
                  //   fontSize: 12,
                  // }}
                />
                <XAxis
                  dataKey="xLabel"
                  tickLine={XAxisOptions[searchDateType.value].tickLine}
                  axisLine={true}
                  tickMargin={8}
                  tickFormatter={XAxisOptions[searchDateType.value].tickFormatter}
                  interval={XAxisOptions[searchDateType.value].interval}
                  padding={{ left: 20, right: 20 }}
                  fontSize={12}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent labelFormatter={labelFormatter(searchDateType)} />}
                />
                <ChartLegend
                  content={<ChartLegendContent />}
                  layout="horizontal"
                  verticalAlign="top"
                  onClick={() => console.log('Legend clicked')}
                  className="sticky left-0"
                  // className="sticky-legend"
                  // className="fixed right-0"
                />
                {createStackedBar()}
              </BarChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StackedBarChart;
