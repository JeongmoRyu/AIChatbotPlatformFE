import BgMainTop from '@/shared/assets/images/bg-main-top.svg';
import tw from 'tailwind-styled-components';
import { FC } from 'react';

const LayoutHome: FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer
      style={{
        backgroundImage: `url(${BgMainTop})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top',
        backgroundPositionY: '-8.5rem',
      }}
    >
      <MainContainer>{children}</MainContainer>
    </LayoutContainer>
  );
};

export default LayoutHome;

const LayoutContainer = tw.div`
  flex
  items-start
  justify-center
  w-full
  h-full
  xxl:gap-[3.75rem]
  bg-background
  relative
`;

const MainContainer = tw.main`
  flex
  flex-col
  items-center
  justify-start
  w-ful
  min-w-[45.25rem]
  xl:min-w-[61.25rem]
  xxl:min-w-[75rem]
  h-full
  py-[5.3125rem]
  mx-[18.75rem]
`;
