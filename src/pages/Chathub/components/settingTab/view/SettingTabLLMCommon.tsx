import { showNotification } from '@/shared/utils/common-helper';
import EditSelectBox from '../../edit/view/EditSelectBox';
import EditTextInputHalf from '../../edit/view/EditTextInputHalf';

interface Props {
  data: LlmCommonType;
  onChange: (type: string, key: string, value: any) => void;
}
export default function SettingTabLLMCommon({ data, onChange }: Props) {
  return (
    <>
      <EditSelectBox
        type="memory"
        labelText="Memory Type"
        name="llm_common.memory_type"
        activeValue={Number(data.memory_type)}
        onChange={(id) => onChange('llm_common', 'memory_type', id)}
      />
      {/* <EditTextInputHalf
        labelText="Memory Window Size"
        id="llm_common.window_size"
        value={String(data.window_size)}
        onChange={(e) => onChange('llm_common', 'window_size', e.target.value)}
        isDisabled={data.memory_type == '0'}
      /> */}
      <EditTextInputHalf
        labelText="Memory Window Size"
        id="llm_common.window_size"
        value={String(data.window_size)}
        onChange={(e) => {
          const inputValue = e.target.value;
          if (/^\d*\.?\d*$/.test(inputValue) || inputValue === '') {
            onChange('llm_common', 'window_size', inputValue);
          } else {
            showNotification('숫자만 입력 가능합니다.', 'error');
          }
        }}
        isDisabled={data.memory_type == '0'}
      />
    </>
  );
}
