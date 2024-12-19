import tw from 'tailwind-styled-components';
import { FC } from 'react';
import useSidebarLeftViewModel from '../viewModel/useSidebarLeftViewModel';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import SettingTab from '@/pages/Chathub/components/settingTab/view/SettingTabMain';

const SidebarLeft: FC = () => {
  const {
    smallSidebarOpen,
    largeSidebarOpen,
    toggleSidebar,
    closeSidebars,
    smallSidebarMotionProps,
    largeSidebarMotionProps,
    chatbotList,
    settingData,
    onValueChange,
    handleChangeImage,
    setValueCheck,
    handleSubmit,
  } = useSidebarLeftViewModel();

  return (
    <>
      <ToggleButton onClick={toggleSidebar} $isOpen={smallSidebarOpen || largeSidebarOpen}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_2429_12177)">
            <path
              d={smallSidebarOpen && largeSidebarOpen ? 'M15 17L10 12L15 7' : 'M10 17L15 12L10 7'}
              stroke="#111111"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_2429_12177">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </ToggleButton>
      <SmallSidebar {...smallSidebarMotionProps}>
        <SmallSidebarHeader>
          <strong>이전 대화 기록</strong>
        </SmallSidebarHeader>
        <div className="flex flex-col"></div>
      </SmallSidebar>
      <LargeSidebar {...largeSidebarMotionProps}>
        <LargeSidebarHeader>
          <strong>챗봇 설정</strong>
        </LargeSidebarHeader>
        <div className="sidebar">
          <div className="page-admin">
            <div className="scroll_wrap">
              <SettingTab
                data={settingData}
                handleChange={onValueChange}
                handleChangeImage={handleChangeImage}
                valueCheck={setValueCheck}
              />
            </div>
            <div className="bottom_box">
              {chatbotList &&
              chatbotList.length > 0 &&
              chatbotList[0]?.total_count !== undefined &&
              chatbotList[0]?.cnt_wait !== undefined &&
              chatbotList[0]?.cnt_complete !== undefined &&
              chatbotList[0]?.cnt_error !== undefined ? (
                chatbotList[0].cnt_complete + chatbotList[0].cnt_error !== chatbotList[0].total_count ? (
                  <div className="flex justify-between h-[30px]">
                    <p className="text-lg text-primary">
                      {`진행 중..... (${chatbotList[0].total_count - chatbotList[0].cnt_wait}/${chatbotList[0].total_count})`}
                    </p>
                    <button type="button" className="btn_embedding" disabled>
                      ....수정중
                    </button>
                  </div>
                ) : (
                  <button type="button" className="btn_type blue" onClick={handleSubmit}>
                    Save
                  </button>
                )
              ) : (
                <button type="button" className="btn_type blue" onClick={handleSubmit}>
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </LargeSidebar>
      {(smallSidebarOpen || largeSidebarOpen) &&
        createPortal(
          <Dimmed
            onClick={closeSidebars}
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

const ToggleButton = tw(motion.div)<{ $isOpen: boolean }>`
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

const SmallSidebar = tw(motion.aside)`
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
  z-20
`;

const SmallSidebarHeader = tw.header`
  w-full
  h-[3.125rem]
  flex
  items-center
  justify-between
  pl-[5rem]
  border-b
  border-line
`;

const LargeSidebar = tw(motion.aside)`
  flex
  flex-col
  items-center
  justify-start
  h-full
  bg-white
  absolute
  left-[3.125rem]
  top-0
  overflow-hidden
  z-20
`;

const LargeSidebarHeader = tw.header`
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
  z-10
`;
