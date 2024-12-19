import React, { TextareaHTMLAttributes } from 'react';

import cn from 'classnames';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string | JSX.Element;
  className?: string;
  boxClassName?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  readOnly?: boolean;
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { onChange, onBlur, id, label, className, boxClassName, value, readOnly, maxLength, ...args },

    ref,
  ) => {
    return (
      <>
        {label && (
          <label htmlFor={id} className={cn('form-label', className)}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`form-control multi !h-40 w-full focus:!border-[#DEE4EB] ${boxClassName}`}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          onBlur={onBlur}
          readOnly={readOnly}
          {...args}
        />
      </>
    );
  },
);

export default Textarea;
