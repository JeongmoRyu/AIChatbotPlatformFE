import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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
  barChartInputColors,
  barChartOutputColors,
  cloneYAxis,
  initXAxisOptions,
  initYAxisOptions,
  labelFormatter,
} from '@/pages/Account/model/useStatisticsModel.ts';
import { motion } from 'framer-motion';

interface StackedBarChartProps {
  title: string;
  data: any[];
  label: any[];
  isOverflowY: boolean;
  count: number;
}

const StackedBarChart = (props: StackedBarChartProps) => {
  const { title, data, label, isOverflowY, count } = props;

  const isFetching = useRecoilValue<boolean>(useIsFetchingStore);
  const searchDateType = useRecoilValue<searchDateTypeProps>(useSearchDateTypeStore);

  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  const YAxisOptions = initYAxisOptions();
  const XAxisOptions = initXAxisOptions(data);

  useEffect(() => {
    const config: ChartConfig = {};

    label.forEach((item: any) => {
      config[item.input] = { label: item.input };
      config[item.output] = { label: item.output };
    });

    setChartConfig(config);
  }, [label]);

  useEffect(() => {
    if (!isOverflowY) return;
    cloneYAxis(count);
  }, [data, isOverflowY]);

  const createStackedBar = () => {
    const barTypes = ['input', 'output'];
    return barTypes.map((type: string) => (
      <Fragment key={type}>
        {label.map((item: any, index: number) => {
          return (
            <Bar
              key={item[type]}
              dataKey={item[type]}
              stackId={type}
              fill={type === 'input' ? barChartInputColors[index] : barChartOutputColors[index]}
              radius={index === 0 ? [0, 0, 4, 4] : index === label.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              // min={2}
              // max={12}
              // style={
              //   {
              //     // cursor: 'pointer',
              //   }
              // }
            />
          );
        })}
      </Fragment>
    ));
  };

  return (
    <Card className="relative w-full h-full border-none rounded-none flex flex-col items-center justify-start gap-2 shadow-none">
      <CardHeader className="p-2 w-full h-auto text-left">
        <CardTitle className="text-[1rem] font-bold leading-[19.09px]">{title}</CardTitle>
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
          <div className="relative w-full h-auto overflow-x-auto scrollbar-thin">
            {isFetching ? (
              <div className="w-full h-[330px] flex items-center justify-center">
                <FadeLoader color="#444444" speedMultiplier={1} width={5} height={17} radius={3} />
              </div>
            ) : (
              <ChartContainer
                config={chartConfig}
                style={{
                  minWidth: 598,
                  // width: data.length * ((Object.keys(data[0]).length / 2) * 12),
                  width: isOverflowY ? data.length * ((Object.keys(data[0]).length / 2) * 12) : 598,
                  height: 330,
                }}
              >
                <BarChart
                  accessibilityLayer
                  data={data}
                  // barSize={10}
                  // barSize={isOverflowY ? 10 : data.length < 8 ? 12 : data.length < 15 ? 6 : 2}
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
                    orientation={'left'}
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
                    fontSize={10}
                  />
                  <ChartTooltip
                    cursor={{
                      stroke: 'red',
                      strokeWidth: 1,
                      strokeDasharray: '3 3',
                      strokeOpacity: 0.5,
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
                  className="sticky left-0"
                  // className="sticky-legend"
                  // className="fixed right-0"
                />*/}
                  {createStackedBar()}
                </BarChart>
              </ChartContainer>
            )}
            {isOverflowY && !isFetching && (
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

export default StackedBarChart;
