interface RadioProps {
  id: string;
  name: string;
  value: string;
  label?: string;
  labelNoSpace?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultChecked?: boolean;
  register?: any;
  checked?: boolean;
  disabled?: boolean;
  labelClassName?: string;
}

function Radio(props: RadioProps) {
  return (
    <div className="mr-4 form-btn mobile:ml-0 mobile:mt-2">
      <input
        id={props.id}
        type="radio"
        name={props.name}
        className="form-check-input "
        value={props.value}
        defaultChecked={props.defaultChecked}
        checked={props.checked}
        {...props.register}
        onChange={props.onChange}
        disabled={props.disabled}
      />
      {props.label && (
        <label
          htmlFor={props.id}
          className={`form-check-label !bg-transparent z-0 ml-1${
            props.labelNoSpace ? '' : 'md:ml-3'
          } ${props.labelClassName && props.labelClassName}`}
        >
          {props.label}
        </label>
      )}
    </div>
  );
}

export default Radio;
