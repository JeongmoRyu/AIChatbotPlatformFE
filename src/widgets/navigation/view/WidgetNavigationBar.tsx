import tw from 'tailwind-styled-components';
import { FC } from 'react';

import WidgetNavigationBarMenuList from './WidgetNavigationBarMenuList';

const TopNav: FC = () => {
  return (
    <TopNavContainer>
      <TopNavLogo>On-premise LLM</TopNavLogo>

      <WidgetNavigationBarMenuList />

      <TopNavProfileWrapper>
        <TopNavProfileButton>W</TopNavProfileButton>
      </TopNavProfileWrapper>
    </TopNavContainer>
  );
};

export default TopNav;

const TopNavContainer = tw.nav`
  w-full
  h-[4.375rem]
  flex
  items-center
  px-[1.875rem]
  py-[.9375rem]
  bg-white
  border-b
  border-line
  gap-x-8
  sticky
  top-0
  left-0
  z-30
`;

const TopNavLogo = tw.h1`
  min-w-[11.875rem]
  font-bold
  text-nowrap
  text-secondary
  text-xl
  whitespace-nowrap
  select-none
`;

const TopNavProfileWrapper = tw.div`
  flex
  justify-end
  items-center
  min-w-[11.875rem]
`;

const TopNavProfileButton = tw.button`
  flex
  justify-center
  items-center
  bg-secondary
  rounded-full
  w-10
  text-base
  text-white
  aspect-square
`;
