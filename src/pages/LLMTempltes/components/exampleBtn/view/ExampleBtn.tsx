import React from 'react';
import GeneralButton from '@/shared/components/GeneralButton/view/GeneralButton';

interface ExampleBtnProps {
  title: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  disabled?: boolean;
}

const ExampleBtn = ({ onClick, title, disabled }: ExampleBtnProps): React.ReactElement => {
  return (
    <GeneralButton
      name={title}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`bg-white border-bd-default-form flex items-center !h-8 w-24 px-4 py-2 mx-2 !rounded-full border hover:bg-secondary-dark text-light font-medium hover:text-white hover:font-bold ${
        disabled ? 'bg-toggle-disabled cursor-not-allowed' : 'bg-[#eaedee] cursor-pointer'
      }`}
    >
      <p className="text-base">{title}</p>
    </GeneralButton>
  );
};

export default ExampleBtn;
