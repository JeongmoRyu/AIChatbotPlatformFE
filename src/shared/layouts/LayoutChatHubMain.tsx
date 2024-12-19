import { FC } from 'react';
import tw from 'tailwind-styled-components';

const LayoutChatHubMain: FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <MainContainer>{children}</MainContainer>
    </LayoutContainer>
  );
};

export default LayoutChatHubMain;

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
  justify-end
  h-full
  w-full
  min-w-[45.25rem]
  xl:min-w-[61.25rem]
  xxl:min-w-[75rem]
  mx-[18.75rem]
`;
