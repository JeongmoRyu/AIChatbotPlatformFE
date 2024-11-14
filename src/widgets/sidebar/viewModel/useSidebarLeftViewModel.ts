import { useMemo, useState } from 'react';

const useSidebarLeftViewModel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShowButton, setIsShowButton] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleButtonMotionProps = useMemo(
    () => ({
      initial: false,
      animate: isShowButton ? 'panelClosed' : 'panelOpend',
      variants: {
        panelOpend: {
          width: 0,
          zIndex: -10,
        },
        panelClosed: {
          width: '3.125rem',
          zIndex: 10,
        },
      },
      translation: {
        delay: 0.3,
      },
    }),
    [isShowButton],
  );

  const togglePanelMotionProps = useMemo(
    () => ({
      initial: false,
      animate: isOpen ? 'panelOpen' : 'panelClose',
      variants: {
        panelOpen: {
          width: '18.75rem',
        },
        panelClose: {
          width: 0,
        },
      },
      onAnimationStart: () => {
        if (!isOpen) return;
        setIsShowButton(!isOpen);
      },
      onAnimationComplete: () => {
        if (isOpen) return;
        setIsShowButton(!isOpen);
      },
    }),
    [isOpen],
  );

  return {
    isOpen,
    toggleSidebar,
    toggleButtonMotionProps,
    togglePanelMotionProps,
  };
};

export default useSidebarLeftViewModel;
