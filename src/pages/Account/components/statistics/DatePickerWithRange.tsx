import { HTMLAttributes, useEffect, useState } from 'react';
import { format, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSetRecoilState } from 'recoil';
import {
  searchEndDate as useSearchEndDateStore,
  searchStartDate as useSearchStartDateStore,
} from '@/shared/store/statistics.ts';

const styles = `
  .selected_date {
    color: #000000;
    background-color: #F5F5F5;
  }

  .range_start, .range_end {
    color: #FFFFFF !important;
    background-color: #3868E0 !important;
  }
`;

const dateFormat = 'yyyy-MM-dd';

const DatePickerWithRange = ({ className }: HTMLAttributes<HTMLDivElement>) => {
  const setSearchStartDate = useSetRecoilState<string>(useSearchStartDateStore);
  const setSearchEndDate = useSetRecoilState<string>(useSearchEndDateStore);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  useEffect(() => {
    if (!date || !date.from || !date.to) return;

    const startDate = format(date.from, dateFormat);
    const endDate = format(date.to, dateFormat);

    setSearchStartDate(startDate);
    setSearchEndDate(endDate);
  }, [date]);

  return (
    <div className={cn('flex gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-auto justify-start text-left font-normal !h-[2.25rem] bg-white border border-[#DDDDDD]',
              !date && 'text-muted-foreground',
            )}
          >
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, dateFormat)} ~ {format(date.to, dateFormat)}
                </>
              ) : (
                format(date.from, dateFormat)
              )
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-none shadow" align="start">
          <style>{styles}</style>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={subMonths(new Date(), 1)}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={ko}
            showOutsideDays={false}
            showWeekNumber={false}
            modifiersClassNames={{
              selected: 'selected_date',
              range_start: 'range_start',
              range_end: 'range_end',
            }}
            max={90}
            toDate={new Date()}
            className="w-full h-full bg-white rounded-md border border-[#DDDDDD]"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerWithRange;
