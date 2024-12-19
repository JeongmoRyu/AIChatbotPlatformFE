import tw from 'tailwind-styled-components';
import { FC } from 'react';

import WidgetNavigationBarMenuList from './WidgetNavigationBarMenuList';
// import LoginToggleMenu from '@/shared/components/toggle/view/LoginToggleMenu';
import UserSelectBox from '@/shared/components/Select/view/UserSelectBox';
import { userLoginState as useUserLoginState } from '@/shared/store/onpromise';
import { useRecoilValue } from 'recoil';

const TopNav: FC = () => {
  const userLoginState = useRecoilValue(useUserLoginState);
  return (
    <TopNavContainer>
      <TopNavLogo>On-premise LLM</TopNavLogo>

      <WidgetNavigationBarMenuList />

      <TopNavProfileWrapper>
        {/* <LoginToggleMenu letter="W" /> */}
        <TopNavProfileButton>W</TopNavProfileButton>
        {userLoginState.accessToken ? <UserSelectBox /> : <button className="ml-4">로그인</button>}
      </TopNavProfileWrapper>
    </TopNavContainer>
  );
};

export default TopNav;

const TopNavContainer = tw.nav`
  w-full
  h-[4rem]

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
