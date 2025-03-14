import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import useWidgetNavigationBarModel from '../model/useWidgetNavigationBarModel';
import { useTranslation } from 'react-i18next';

const useWidgetNavigationBarViewModel = () => {
  const model = useWidgetNavigationBarModel();
  const { pathname } = useLocation();
  const { t } = useTranslation(['menu']);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyles({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    }
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    document.body.appendChild(dropdownContainer);
    return () => {
      document.body.removeChild(dropdownContainer);
    };
  }, [dropdownContainer]);

  const currentMenuName = useMemo(() => {
    console.log(pathname);
    const menu = model.menuList.find((menu) => menu.to === pathname);
    if (pathname === '/embedding-leaderboard' || pathname === '/embedding-ranker') {
      return 'Embedding Ranker';
    }
    if (pathname.startsWith('/chatroom') || pathname === '/chatbuilder' || pathname === '/function') {
      return '챗허브';
    }
    if (pathname.startsWith('/llm-template')) {
      return 'LLM 템플릿';
    }
    if (!pathname || !menu) return '';
    return t(menu.title);
    // return menu ? t(menu.title) : '';
  }, [pathname, model.menuList, t]);

  const menuList = useMemo(() => {
    // 현재 페이지를 찾아서 isActive를 true로 설정
    // 현재 페이지를 목록의 첫 번째로 이동
    const list: { to: string; title: string; isActive: boolean }[] = [];

    model.menuList.forEach((menu) => {
      if (menu.to === pathname) {
        list.unshift({ ...menu, title: t(menu.title), isActive: true });
      } else {
        list.push({ ...menu, title: t(menu.title), isActive: false });
      }
    });

    return list;
  }, [model.menuList, pathname]);
  const unSortedMenuList = useMemo(
    () =>
      model.menuList.map((menu) => ({
        ...menu,
        title: t(menu.title),
        isActive: menu.to === pathname,
      })),
    [model.menuList, pathname],
  );

  return {
    menuList,
    unSortedMenuList,
    currentMenuName,
    isDropdownOpen,
    dropdownStyles,
    dropdownContainer,
    buttonRef,
    dropdownRef,
    toggleDropdown,
    setIsDropdownOpen,
  };
};

export default useWidgetNavigationBarViewModel;
