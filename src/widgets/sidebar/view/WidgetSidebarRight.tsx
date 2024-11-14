// @/widgets/sidebar/view/WidgetSidebarRight.tsx

import tw from 'tailwind-styled-components';
import { FC, useState } from 'react';
import { motion } from 'framer-motion';
const RightSideContainer = tw(motion.aside)`
  w-[18.75rem]
  flex
  flex-col
  items-center
  justify-start
  h-full
  bg-white
  border-r
  absolute
  right-0
  top-0
  overflow-hidden
`;
const SidebarRight: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  return (
    <RightSideContainer
      variants={{
        hidden: { width: '0rem' },
        visible: {
          opacity: 1,
          width: isOpen ? '18.75rem' : '0rem',
          transition: {
            stiffness: 100,
            damping: 20,
            duration: 0.5,
          },
        },
      }}
      initial="hidden"
      animate="visible"
      onClick={toggleSidebar}
    >
      <h2>Right Side</h2>
    </RightSideContainer>
  );
};

export default SidebarRight;
