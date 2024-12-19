import React from 'react';

interface LabelProps {
  text: string;
  required?: boolean;
  children?: React.ReactNode;
}

const LabelComponent: React.FC<LabelProps> = ({ text, required, children }) => {
  return (
    <div className={`text-base leading-10 mr-1 ${children ? 'flex justify-between' : ''}`}>
      <div>
        {text}
        {required && <span className="ml-1 text-red-500">*</span>}
      </div>
      {children}
    </div>
  );
};

export default LabelComponent;
