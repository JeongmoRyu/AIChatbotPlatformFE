import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// 모델 인터페이스 정의
interface IItem {
  id: string;
  name: string;
  isActive?: boolean;
}

const useWidgetNavigationBarViewItem = (
  list: { id: string; name: string; category?: 'maum' | 'third-party'; isActive?: boolean }[],
  value: string,
  setValue: Dispatch<SetStateAction<string>>,
): {
  itemList: IItem[];
  selectedItemName: string;
  selectedItemId: string;
  setSelectedItemId: (value: string) => void;
  isDropdownOpen: boolean;
  dropdownStyles: { top: number; left: number; width: number; height: number };
  dropdownContainer: HTMLDivElement;
  buttonRef: React.RefObject<HTMLButtonElement>;
  dropdownRef: React.RefObject<HTMLUListElement>;
  toggleDropdown: () => void;
  setIsDropdownOpen: (value: boolean) => void;
  groupedItemList: { name: string; list: IItem[] }[];
} => {
  const { pathname } = useLocation();

  const [selectedItemId, setSelectedItemId] = useState(value || 'hummingbird');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownContainer] = useState(() => document.createElement('div'));
  const [dropdownStyles, setDropdownStyles] = useState<{ top: number; left: number; width: number; height: number }>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const dropdownRef = useRef<HTMLUListElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, handleClickOutside]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => {
      console.log('toggleDropdown', prev);
      if (prev) {
        return false;
      } else if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownStyles({
          top: rect.bottom + rect.height + 5 + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
        return true;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    document.body.appendChild(dropdownContainer);
    return () => {
      document.body.removeChild(dropdownContainer);
    };
  }, [dropdownContainer]);

  const selectedItemName = useMemo(() => {
    const selectedItem = list.find((item: IItem) => item.id === selectedItemId);
    if (!pathname || !selectedItem) return '';
    return selectedItem ? selectedItem.name : '';
  }, [pathname, list, selectedItemId]);

  const itemList = useMemo(() => {
    // 현재 페이지를 찾아서 isActive를 true로 설정
    // 현재 페이지를 목록의 첫 번째로 이동
    const currentList: { id: string; name: string; isActive?: boolean }[] = [];

    list.forEach((item: IItem) => {
      if (item.id === selectedItemId) {
        currentList.unshift({ ...item, isActive: true });
      } else {
        currentList.push({ ...item, isActive: false });
      }
    });

    return currentList;
  }, [list, pathname, selectedItemId]);

  useEffect(() => {
    setValue(selectedItemId);
  }, [selectedItemId, setValue]);

  const groupedItemList = useMemo(() => {
    // const categories = new Set(list.map((item) => item.category));
    // Set을 사용하지 않고, 중복되지 않는 순서대로 카테고리를 유지
    const categories: (string | undefined)[] = [];
    list.forEach((item) => {
      if (!categories.includes(item.category)) {
        categories.push(item.category);
      }
    });

    const groupedItems = categories.map((category) => ({
      name: category || '',
      list: list.filter((item) => item.category === category),
    }));
    return groupedItems;
  }, [list]);

  return {
    itemList,
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
  };
};

export default useWidgetNavigationBarViewItem;
