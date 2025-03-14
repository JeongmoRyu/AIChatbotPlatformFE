import tw from 'tailwind-styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { forwardRef } from 'react';

import useWidgetNavigationBarViewModel from '../viewModel/useNavigationBarViewModel';

const WidgetNavigationBarMenuList = () => {
  const {
    isDropdownOpen,
    dropdownContainer,
    dropdownStyles,
    buttonRef,
    dropdownRef,
    toggleDropdown,
    setIsDropdownOpen,
    currentMenuName,
    menuList,
    unSortedMenuList,
  } = useWidgetNavigationBarViewModel();
  return (
    <div className="w-full xl:flex xl:justify-center">
      {menuList && menuList.length > 0 && (
        <>
          {/* Desktop 메뉴 */}
          <ul className="hidden gap-5 text-sm xl:flex">
            {unSortedMenuList.map((menu, index) => (
              <li
                key={`${menu.title}-${index}`}
                className="p-2.5"
                style={{
                  fontWeight: menu.isActive ? 'bold' : 'normal',
                  letterSpacing: menu.isActive ? '-0.02em' : '0em',
                }}
              >
                <Link to={menu.to}>{menu.title}</Link>
              </li>
            ))}
          </ul>

          {/* Mobile 콤보박스 버튼 */}
          <MobileMenuButton ref={buttonRef} onClick={toggleDropdown}>
            {currentMenuName}
            <motion.svg
              initial={{ rotate: 0, zIndex: 10 }}
              animate={{ rotate: isDropdownOpen ? 180 : 0, zIndex: isDropdownOpen ? 100 : 10 }}
              transition={{ duration: 0.3 }}
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isDropdownOpen ? 'black' : 'currentColor'}
            >
              <path
                fillRule="evenodd"
                d="M6.28 8.65a.9.9 0 011.27.03L12 13.17l4.45-4.49a.9.9 0 111.29 1.25l-5.1 5.16a.9.9 0 01-1.29 0l-5.1-5.16a.9.9 0 01.03-1.28z"
                clipRule="evenodd"
              />
            </motion.svg>
          </MobileMenuButton>

          {/* 드롭다운 메뉴 - Portal로 body에 렌더링 */}
          {createPortal(
            <AnimatePresence>
              {isDropdownOpen && (
                <MotionDropdownMenu
                  ref={dropdownRef}
                  initial={{ opacity: 0, height: '3.25rem' }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: '3.25rem' }}
                  transition={{ duration: 0.3 }}
                  style={{ top: dropdownStyles.top - dropdownStyles.height, left: dropdownStyles.left }}
                  key="dropdown"
                >
                  {menuList.map((menu, index) => (
                    <ComboBoxMenuItem $isActive={menu.isActive} key={`combobox-${menu.title}-${index}`}>
                      <Link
                        to={menu.to}
                        className="flex justify-between items-center gap-2 p-[.875rem] w-full h-full"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {menu.title}
                        {index === 0 && (
                          <motion.svg
                            initial={{ rotate: 0, zIndex: 10 }}
                            animate={{ rotate: isDropdownOpen ? 180 : 0, zIndex: isDropdownOpen ? 100 : 10 }}
                            transition={{ duration: 0.3 }}
                            className="w-6 h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.28 8.65a.9.9 0 011.27.03L12 13.17l4.45-4.49a.9.9 0 111.29 1.25l-5.1 5.16a.9.9 0 01-1.29 0l-5.1-5.16a.9.9 0 01.03-1.28z"
                              clipRule="evenodd"
                            />
                          </motion.svg>
                        )}
                      </Link>
                    </ComboBoxMenuItem>
                  ))}
                </MotionDropdownMenu>
              )}
            </AnimatePresence>,
            dropdownContainer,
          )}
        </>
      )}
    </div>
  );
};

export default WidgetNavigationBarMenuList;

const MotionDropdownMenu = forwardRef<HTMLUListElement, React.ComponentProps<typeof motion.ul>>((props, ref) => {
  return (
    <motion.ul
      ref={ref}
      {...props}
      className={`absolute rounded-lg shadow-lg text-sm z-30 overflow-hidden ${props.className}`}
    >
      {props.children}
    </motion.ul>
  );
});

const MobileMenuButton = tw.button`
  xl:hidden
  shadow
  justify-between
  items-center
  flex
  bg-white
  text-sm
  text-gray-900
  rounded-lg
  p-[.875rem]
  min-w-[9.375rem]
  h-[3.25rem]
  focus:outline-none
  border-line
  border
  gap-2
`;

const ComboBoxMenuItem = tw.li<{ $isActive: boolean }>`
  min-w-[9.375rem]
  h-[3.25rem]
  bg-white
   hover:font-bold
  hover:bg-gray-700
  translation
  duration-300
  ${(props) => (props.$isActive ? 'bg-gray-700 text-white' : '')}
`;
