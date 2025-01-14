import { MouseEvent, useCallback, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useForm } from 'react-hook-form';
import { Tooltip } from 'react-tooltip';
import Select from '@/shared/components/Select/view/Select.tsx';
import DatePickerWithRange from '@/pages/Account/components/statistics/DatePickerWithRange.tsx';
import ico_filedownload from '@/shared/assets/images/icons/ico_filedownload.svg';
import ico_info_black from '@/shared/assets/images/icons/ico_info_black.svg';
import { searchDateTypeList } from '@/pages/Account/model/useStatisticsModel.ts';
import {
  isFetching as useIsFetchingStore,
  searchDateLabelTypes,
  searchDateType as useSearchDateTypeStore,
  searchDateTypeProps,
  searchDateValueTypes,
} from '@/shared/store/statistics.ts';
import { showNotification } from '@/shared/utils/common-helper.tsx';

interface IFormValues {
  type: string;
  period: string;
}

interface DashboardHeaderProps {
  onClick: (startDate: string, endDate: string) => void;
}

const DashboardHeader = (props: DashboardHeaderProps) => {
  const {
    register,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: {
      type: '',
      period: '',
    },
  });

  const isFetching = useRecoilValue<boolean>(useIsFetchingStore);
  const [searchDateType, setSearchDateType] = useRecoilState<searchDateTypeProps>(useSearchDateTypeStore);

  const [calStartDate, setCalStartDate] = useState<string>('');
  const [calEndDate, setCalEndDate] = useState<string>('');

  const handleSearchDateType = (e: MouseEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.dataset.value) return;
    const label = e.currentTarget.dataset.label as searchDateLabelTypes;
    const value = e.currentTarget.dataset.value as searchDateValueTypes;
    setSearchDateType(() => ({ value, label }));
  };

  const handleOnClick = useCallback(() => {
    props.onClick(calStartDate, calEndDate);
  }, [calStartDate, calEndDate]);

  return (
    <div className="w-full h-[3.125rem] bg-[#F4F6F8] rounded-lg">
      <div className="w-full h-full flex justify-between items-center pl-[1rem] pr-[.625rem] py-2">
        <div className="w-auto h-full flex justify-center items-center text-center gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="w-auto h-full leading-[16.71px] text-[.875rem]">기간 선택</div>
            <Select
              register={{ ...register('type') }}
              id="type"
              typeList={searchDateTypeList}
              placeholder=""
              defaultValue={searchDateType.value}
              defaultLabel={searchDateType.label}
              boxClassName="!w-[8.5rem] !h-[2.25rem] text-[.875rem]"
              buttonClassName="!w-[8.5rem] !h-[2.25rem]"
              onClick={handleSearchDateType}
              error={errors.hasOwnProperty('type')}
              disabled={isFetching}
            />
            {searchDateType.value === 'PERIOD' && (
              <>
                <DatePickerWithRange
                  onChangeStartDate={(startDate: string) => setCalStartDate(startDate)}
                  onChangeEndDate={(endDate: string) => setCalEndDate(endDate)}
                />
                <img
                  src={ico_info_black}
                  alt="info"
                  className="w-5 h-5 cursor-help"
                  data-tooltip-id="tooltip-max-period"
                />
                <Tooltip id="tooltip-max-period" content="최대 90일까지 선택할 수 있습니다." />
                <button
                  className="btn_type bg-[#444444] !min-w-0 w-auto h-full rounded-md text-[1rem] !px-3 flex items-center justify-center"
                  onClick={handleOnClick}
                  disabled={calStartDate === '' || calEndDate === ''}
                >
                  조회
                </button>
              </>
            )}
          </div>
        </div>
        <div>
          <button
            className="btn_type middle white !h-[2.25rem] flex items-center justify-center gap-1"
            onClick={() => showNotification('해당 기능은 준비중입니다.', 'info')}
          >
            <img src={ico_filedownload} alt="Upload" className="!w-[18px] !h-[18px] !m-0" />
            <span className="text-[.875rem]">엑셀 다운로드</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
