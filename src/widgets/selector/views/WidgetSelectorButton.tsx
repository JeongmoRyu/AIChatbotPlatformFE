import { RefObject } from 'react';
import { cn } from '@/shared/utils/cn';
import { cva } from 'class-variance-authority';
import { motion } from 'framer-motion';

const menuButtonStyles = cva(
  'flex justify-between items-center gap-2 shadow p-[.875rem] border border-line rounded-lg w-[21.875rem] h-[3.125rem] focus:outline-none font-bold text-lg',
  {
    variants: {
      isOpen: {
        true: 'bg-white text-[#1A68B2]',
        false: 'bg-white text-black',
      },
    },
    defaultVariants: {
      isOpen: false,
    },
  },
);

const WidgetSelectorButton = ({
  buttonRef,
  toggleDropdown,
  currentLabel,
  isDropdownOpen,
}: {
  buttonRef: RefObject<HTMLButtonElement>;
  toggleDropdown: () => void;
  currentLabel: string;
  isDropdownOpen: boolean;
}) => {
  return (
    <button className={cn(menuButtonStyles({ isOpen: true }))} ref={buttonRef} onClick={toggleDropdown}>
      {currentLabel}
      <motion.svg
        initial={{ rotate: 0 }}
        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M6.28 8.65a.9.9 0 011.27.03L12 13.17l4.45-4.49a.9.9 0 111.29 1.25l-5.1 5.16a.9.9 0 01-1.29 0l-5.1-5.16a.9.9 0 01.03-1.28z"
          clipRule="evenodd"
        />
      </motion.svg>
    </button>
  );
};

export default WidgetSelectorButton;
