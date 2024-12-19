import { FC } from 'react';

import tw from 'tailwind-styled-components';

const LayoutChatHub: FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      {/* <SidebarLeft /> */}
      <MainContainer>
        {children}
        {/* {React.isValidElement(children) ? React.cloneElement(children as ReactElement, additionalProps) : children} */}
      </MainContainer>
      {/* <SidebarRight isOpen={isOpen} logData={logData} setIsOpen={setIsOpen} /> */}
    </LayoutContainer>
  );
};

export default LayoutChatHub;

// Asis
const LayoutContainer = tw.div`
  flex
  items-start
  justify-center
  w-full
  h-full
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
