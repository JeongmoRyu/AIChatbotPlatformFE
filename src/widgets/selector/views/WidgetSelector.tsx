import tw from 'tailwind-styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { Dispatch, SetStateAction } from 'react';
import { cn } from '@/shared/utils/cn';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import WidgetSelectorButton from './WidgetSelectorButton';
import useWidgetSelectorViewModel from '../viewModels/useWidgetSelectorViewModel';

const WidgetSelector = ({
  list,
  value,
  setValue,
}: {
  list: { id: string; name: string; isActive?: boolean; category?: 'maum' | 'third-party' }[];
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}) => {
  const { t, i18n } = useTranslation(['aiChat']);

  const {
    selectedItemName,
    selectedItemId,
    setSelectedItemId,
    isDropdownOpen,
    dropdownStyles,
    dropdownContainer,
    buttonRef,
    dropdownRef,
    toggleDropdown,
    setIsDropdownOpen,
    groupedItemList,
  } = useWidgetSelectorViewModel(list, value, setValue);

  return (
    <div className="flex justify-center items-center gap-2.5 w-full h-auto font-medium text-[#444444] text-lg">
      {i18n.language === 'ko' && (
        <>
          <WidgetSelectorButton
            isDropdownOpen={isDropdownOpen}
            buttonRef={buttonRef}
            toggleDropdown={toggleDropdown}
            currentLabel={selectedItemName}
          />
          {t('aiChat:와_대화해_보세요')}
        </>
      )}
      {i18n.language === 'en' && (
        <>
          {t('aiChat:와_대화해_보세요')}
          <WidgetSelectorButton
            isDropdownOpen={isDropdownOpen}
            buttonRef={buttonRef}
            toggleDropdown={toggleDropdown}
            currentLabel={selectedItemName}
          />
        </>
      )}
      {createPortal(
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.ul
              ref={dropdownRef}
              initial={{ opacity: 0, height: '3.25rem' }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: '3.25rem' }}
              transition={{ duration: 0.3 }}
              style={{ top: dropdownStyles.top - dropdownStyles.height, left: dropdownStyles.left }}
              key="dropdown"
              className="absolute z-30 overflow-hidden text-sm rounded-lg shadow-lg"
            >
              {groupedItemList.map(({ name, list }) => (
                <motion.li
                  key={name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn('min-w-[21.875rem]', 'bg-white', 'last:pb-2')}
                >
                  <div className={cn('text-[#7B8188] font-bold', 'h-12', 'px-3.5 py-2', 'flex items-center')}>
                    {name}
                  </div>
                  <ul className="">
                    {list.map((item) => (
                      <UIComboBoxMenuItem
                        key={item.id}
                        $isActive={selectedItemId === item.id}
                        onClick={() => {
                          setSelectedItemId(item.id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {item.name}
                      </UIComboBoxMenuItem>
                    ))}
                  </ul>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>,
        dropdownContainer,
      )}
    </div>
  );
};

export default WidgetSelector;

const UIComboBoxMenuItem = tw.li<{ $isActive: boolean }>`
  min-w-[21.875rem] h-9
  bg-white
  text-[#111111]
  hover:bg-[#FAF6F8]
  hover:cursor-pointer
  hover:font-bold
  translation
  duration-150
  text-base
  flex items-center
  py-2
  px-3.5
  ${(props) => (props.$isActive ? 'bg-[#FAF6F8] font-bold hover:bg-[#FAF6F8]' : '')}
`;
