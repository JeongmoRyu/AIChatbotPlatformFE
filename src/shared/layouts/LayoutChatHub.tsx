// @/shared/layouts/LayoutChatHub
import { FC } from 'react';
import tw from 'tailwind-styled-components';

import SidebarLeft from '@/widgets/sidebar/view/WidgetSidebarLeft';
import SidebarRight from '@/widgets/sidebar/view/WidgetSidebarRight';

const LayoutChatHub: FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <SidebarLeft />
      <MainContainer>{children}</MainContainer>
      <SidebarRight />
    </LayoutContainer>
  );
};

export default LayoutChatHub;

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
  w-ful
  min-w-[45.25rem]
  xl:min-w-[61.25rem]
  xxl:min-w-[75rem]
  h-full
  mx-[18.75rem]
`;
