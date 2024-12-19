import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  className?: string;
  value?: string | number;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAutocomplete?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ disabled, type = 'text', id, label, className, value, placeholder, onChange, isAutocomplete, ...args }, ref) => {
    return (
      <>
        <input
          id={id}
          ref={ref}
          type={type}
          className={`form-control ${className ? className : ''}`}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete={isAutocomplete ? 'on' : 'off'}
          {...args}
        />
      </>
    );
  },
);

export default Input;
