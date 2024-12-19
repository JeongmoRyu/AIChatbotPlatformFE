import { FC } from 'react';
import tw from 'tailwind-styled-components';

const LayoutChatHubBuilder: FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <MainContainer>{children}</MainContainer>
    </LayoutContainer>
  );
};

export default LayoutChatHubBuilder;

const LayoutContainer = tw.div`
  flex
  items-start
  justify-center
  h-full
  w-full
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
`;
