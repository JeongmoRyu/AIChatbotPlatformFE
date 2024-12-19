import tw from 'tailwind-styled-components';
import { Dispatch, FC, SetStateAction } from 'react';
import { motion } from 'framer-motion';
import LogDataPipeLine from '@/pages/Chathub/components/Chat/view/LogDataPipeLine';
// w-[18.75rem]

const RightSideContainer = tw(motion.aside)`
  w-[20rem]
  h-full
  flex
  flex-col
  items-center
  justify-start
  h-full
  bg-white
  border-r
  border-bd-disabled
  absolute
  right-0
  top-0
  overflow-hidden
`;

const SidebarRight: FC<{ isOpen: boolean; logData: IDashBoardLogs; setIsOpen: Dispatch<SetStateAction<boolean>> }> = ({
  isOpen,
  logData,
  setIsOpen,
}) => {
  console.log('SidebarRight isOpen:', isOpen);
  console.log('SidebarRight logData:', logData);

  return (
    <RightSideContainer
      variants={{
        hidden: { width: '0rem' },
        visible: {
          opacity: 1,
          width: isOpen ? '20rem' : '0rem',
          transition: {
            stiffness: 100,
            damping: 100,
            duration: 0.3,
          },
        },
      }}
      initial={false}
      animate="visible"
      // onClick={toggleSidebar}
    >
      <div className={'chathub-sidebar'}>
        <div className="sidebar">
          {/* <div className={`sidebar ${sidebarState && 'open'}`}> */}
          <div className="sidebar_head">
            <h2 className="title">Edit Chatbot</h2>
            <button onClick={() => setIsOpen(false)} className="btn_close">
              닫기
            </button>
          </div>
        </div>
        <LogDataPipeLine logData={logData} />
      </div>
    </RightSideContainer>
  );
};

export default SidebarRight;
