// @/widgets/sidebar/view/WidgetSidebarLeft.tsx

import tw from 'tailwind-styled-components';
import { FC } from 'react';
import useSidebarLeftViewModel from '../viewModel/useSidebarLeftViewModel';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

const SidebarLeft: FC = () => {
  const { isOpen, toggleSidebar, toggleButtonMotionProps, togglePanelMotionProps } = useSidebarLeftViewModel();
  return (
    <>
      <LeftSideButton onClick={toggleSidebar} $isOpen={isOpen} {...toggleButtonMotionProps}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_2429_12177)">
            <path d="M10 17L15 12" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 12L10 7" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_2429_12177">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </LeftSideButton>
      <LeftSideContainer $isOpen={isOpen} onClick={toggleSidebar} {...togglePanelMotionProps}>
        <LeftSideHeader>
          <strong>챗봇 설정</strong>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2429_12177)">
              <path d="M10 17L15 12" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 12L10 7" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_2429_12177">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </LeftSideHeader>
      </LeftSideContainer>
      {isOpen &&
        createPortal(
          <Dimmed
            onClick={toggleSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />,
          document.getElementById('dimmed-root') as HTMLElement,
        )}
    </>
  );
};

export default SidebarLeft;

const LeftSideButton = tw(motion.div)<{ $isOpen: boolean }>`
  w-[3.125rem]
  h-[3.125rem]
  flex
  items-center
  justify-center
  bg-white
  border-r
  border-b
  border-line
  absolute
  left-0
  top-0
  hover:bg-gray-100
  cursor-pointer
  transform
  transition-transform
  duration-300
  z-30
`;

const LeftSideContainer = tw(motion.aside)<{ $isOpen: boolean }>`
  flex
  flex-col
  items-center
  justify-start
  h-full
  bg-white
  border-r
  border-line
  absolute
  left-0
  top-0
  overflow-hidden
  transform
  transition-transform
  duration-300
  w-[18.75rem]
  whitespace-nowrap
  word-nowrap
  z-30
`;

const LeftSideHeader = tw.header`
  w-full
  h-[3.125rem]
  flex
  items-center
  justify-between
  pl-5
  border-b
  border-line
`;

const Dimmed = tw(motion.div)`
  fixed
  inset-0
  bg-black
  z-20
`;
