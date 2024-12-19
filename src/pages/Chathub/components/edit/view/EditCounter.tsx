import { useEditCounter } from '../viewModel/useEditCounterViewModel';

interface Props {
  fix?: number;
  title: string;
  id: string;
  value: string;
  onChange: (val: string) => void;
  step?: number;
}

export default function EditCounter({ title, id, value, onChange, step, fix }: Props) {
  const { handleSubtract, handleAdd, handleChange } = useEditCounter(value, onChange, step, fix);

  return (
    <div className="counter_wrap">
      <label className="txt_label" htmlFor={id}>
        {title}
      </label>
      <div>
        <button type="button" className="btn_subtract" onClick={handleSubtract}>
          -
        </button>
        <input type="text" id={id} value={value} onChange={handleChange} disabled={!!step} />
        <button type="button" className="btn_add" onClick={handleAdd}>
          +
        </button>
      </div>
    </div>
  );
}
