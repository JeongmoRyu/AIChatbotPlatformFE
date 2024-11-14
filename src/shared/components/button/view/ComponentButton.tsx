import { FC } from 'react';
import tw from 'tailwind-styled-components';
import useComponentButtonViewModel from '../viewModel/useComponentButtonViewModel';

interface ButtonComponentProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'small' | 'large';
}

const ComponentButton: FC<ButtonComponentProps> = ({ children, type = 'small', ...props }) => {
  const data = useComponentButtonViewModel(props);
  console.log(data);
  return (
    <Button {...props} $type={type}>
      {children}
    </Button>
  );
};

export default ComponentButton;

const Button = tw.div<{ $type: string }>`
  bg-white
  rounded-lg
  border
  border-line
  flex
  justify-between
  gap-[.3125rem]
  text-sm
  ${({ $type }) => {
    switch ($type) {
      case 'large':
        return `
          py-2.5
          px-5
        `;
      case 'small':
      default:
        return `
          py-2
          px-2.5
        `;
    }
  }}

`;
