export function useEditCounter(value: string, onChange: (val: string) => void, step?: number, fix?: number) {
  const handleSubtract = () => {
    if (+value > 0) {
      const newValue =
        fix !== undefined ? (+value - (step ? step : 1)).toFixed(fix) : String(+value - (step ? step : 1));
      // const newValue = (+value - (step ? step : 1)).toFixed(1);
      onChange(newValue);
    }
  };

  const handleAdd = () => {
    const newValue = fix !== undefined ? (+value + (step ? step : 1)).toFixed(fix) : String(+value + (step ? step : 1));
    // const newValue = (+value + (step ? step : 1)).toFixed(1);
    onChange(String(newValue));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value);

  return { handleSubtract, handleAdd, handleChange };
}
