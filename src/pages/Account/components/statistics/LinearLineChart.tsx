import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  isFetching as useIsFetchingStore,
  searchDateType as useSearchDateTypeStore,
  searchDateTypeProps,
} from '@/shared/store/statistics.ts';
import { useRecoilValue } from 'recoil';
import { Fragment, useEffect, useState } from 'react';
import { FadeLoader } from 'react-spinners';
import {
  lineChartTotalColors,
  cloeYAxis,
  initXAxisOptions,
  initYAxisOptions,
  labelFormatter,
} from '@/pages/Account/model/useStatisticsModel.ts';
import { motion } from 'framer-motion';

interface LinearLineChartProps {
  title: string;
  data: any[];
  label: any[];
  isOverflowY: boolean;
  count: number;
}

const LinearLineChart = (props: LinearLineChartProps) => {
  const { title, data, label, isOverflowY, count } = props;

  const isFetching = useRecoilValue<boolean>(useIsFetchingStore);
  const searchDateType = useRecoilValue<searchDateTypeProps>(useSearchDateTypeStore);

  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  const YAxisOptions = initYAxisOptions();
  const XAxisOptions = initXAxisOptions(data);

  useEffect(() => {
    const config: ChartConfig = {};

    label.forEach((item: any) => {
      config[item.total] = { label: item.label };
    });

    setChartConfig(config);
  }, [label]);

  useEffect(() => {
    if (!isOverflowY) return;
    cloeYAxis(count);
  }, [data, isOverflowY]);

  const createLinearLine = () =>
    label.map((item: any, index: number) => (
      <Fragment key={item.label}>
        <Line key={item.total} type="linear" dataKey={item.total} stroke={lineChartTotalColors[index]} />
      </Fragment>
    ));

  return (
    <Card className="relative w-full h-full border-none rounded-none flex flex-col items-center justify-start gap-2 shadow-none">
      <CardHeader className="p-2 w-full h-auto text-left">
        <CardTitle className="text-[1rem] font-bold leading-[19.09px]">{title}</CardTitle>
        {/*<CardDescription>Line Chart - Linear</CardDescription>*/}
      </CardHeader>
      <CardContent
        className="w-full h-auto p-0"
        style={{
          transform: 'translateZ(0)',
        }}
      >
        <motion.div
          key={JSON.stringify(data)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
        >
          <div className="w-full h-auto overflow-x-auto relative">
            {isFetching ? (
              <div className="w-full h-[330px] flex items-center justify-center">
                <FadeLoader color="#444444" speedMultiplier={1} width={5} height={17} radius={3} />
              </div>
            ) : (
              <ChartContainer
                config={chartConfig}
                style={{
                  minWidth: 598,
                  // width: data.length * ((Object.keys(data[0]).length / 2) * 17),
                  width: isOverflowY ? data.length * ((Object.keys(data[0]).length / 2) * 17) : 598,
                  height: 330,
                }}
              >
                <LineChart
                  accessibilityLayer
                  data={data}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={true} horizontal={true} />
                  <YAxis
                    tickLine={YAxisOptions.tickLine}
                    axisLine={true}
                    tickMargin={8}
                    tickFormatter={YAxisOptions.tickFormatter}
                    tickCount={YAxisOptions.tickCount}
                    width={30}
                    fontSize={10}
                  />
                  <XAxis
                    dataKey="xLabel"
                    tickLine={XAxisOptions[searchDateType.value].tickLine}
                    axisLine={true}
                    tickMargin={8}
                    tickFormatter={XAxisOptions[searchDateType.value].tickFormatter}
                    interval={XAxisOptions[searchDateType.value].interval}
                    padding={{ left: 20, right: 20 }}
                    fontSize={10}
                  />

                  <ChartTooltip
                    cursor={{
                      stroke: 'red',
                      strokeWidth: 2,
                      strokeDasharray: '3 3',
                      pointerEvents: 'none',
                    }}
                    content={<ChartTooltipContent labelFormatter={labelFormatter(searchDateType)} />}
                    filterNull={true}
                    isAnimationActive={true}
                    animationDuration={500}
                    animationEasing="ease"
                  />
                  {/*<ChartLegend
                  content={<ChartLegendContent />}
                  layout="horizontal"
                  verticalAlign="top"
                  onClick={() => console.log('Legend clicked')}
                  // className="sticky-legend"
                  // className="fixed right-0"
                />*/}
                  {createLinearLine()}
                </LineChart>
              </ChartContainer>
            )}
            {isOverflowY && (
              <div className="fixed top-0 left-0 w-[42px] h-[330px] bg-white z-50">
                <svg id={`clonedSvg_${count}`} width="42" height="330" viewBox="0 0 42 330" fill="#FFFFFF" />
              </div>
            )}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default LinearLineChart;
