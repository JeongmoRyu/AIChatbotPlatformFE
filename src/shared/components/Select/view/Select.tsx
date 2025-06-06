import React from 'react';
import useSelectViewModel from '../viewModel/useSelectViewModel';

interface SelectProps {
  ref?: any;
  id?: string;
  name?: string;
  btnName?: string;
  control?: any;
  register?: any;
  typeList: any;
  placeholder?: string | null;
  boxClassName?: string;
  buttonClassName?: string;
  defaultValue?: string | number;
  defaultLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  error?: boolean;
  reset?: boolean;
  disabled?: boolean;
}

const Select = (props: SelectProps) => {
  const {
    selectboxRef,
    selectboxClass,
    selectedValue,
    selectedBtnRef,
    selectedBtnState,
    handleSelectList,
    selectedLabel,
    isSelectHide,
    handleOnChangeSelect,
  } = useSelectViewModel(props);

  return (
    <div ref={selectboxRef} className={`selectbox ${selectboxClass} ${props.boxClassName}`}>
      <select {...props.register} id={props.id} name={props.name} defaultValue={selectedValue}>
        {props.placeholder && <option value="">{props.placeholder}</option>}
        {props.typeList &&
          props.typeList.map((type: any) => {
            return (
              <option key={`select_${type.value}`} value={type.value}>
                {type.label}
              </option>
            );
          })}
      </select>
      <button
        ref={selectedBtnRef}
        type="button"
        name={props.name}
        disabled={props.disabled}
        className={`select-selected ${selectedBtnState} ${props.disabled ? '!cursor-not-allowed' : 'cursor-pointer'} ${props.buttonClassName}`}
        onClick={handleSelectList}
      >
        {selectedLabel}
      </button>
      <div className={`select-items overflow-x-hidden ${isSelectHide}`}>
        {props.placeholder && (
          <button
            type="button"
            data-value=""
            className="hover:!bg-primary-darkblue"
            data-label={props.placeholder}
            onClick={handleOnChangeSelect}
          >
            {props.placeholder}
          </button>
        )}
        {props.typeList &&
          props.typeList.map((item: any) => {
            if (item.label === selectedLabel) return null;
            return (
              <button
                type="button"
                key={`btn_${item.value}`}
                data-value={item.value}
                data-label={item.label}
                name={props.btnName}
                onClick={handleOnChangeSelect}
                className={`hover:!bg-primary-darkblue ${props.buttonClassName}`}
              >
                {item.label}
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default Select;
