import { userAuthority as useUserAuthority } from '@/shared/store/onpromise';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

interface Menu {
  label: string;
  to: string;
}

const useWidgetNavigationBarModel = () => {
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const userAuthority = useRecoilValue(useUserAuthority);

  let pathname = window.location.pathname;
  if (!pathname.startsWith('/llm-template')) pathname = '';

  useEffect(() => {
    // fetchMenuList().then((list) => setMenuList(list));
    fetchMenuList(pathname).then((list) => {
      const adjustedList = userAuthority === '' ? list.filter((item) => item.label !== 'Embedding Ranker') : list;
      setMenuList(adjustedList);
    });
  }, []);

  return { menuList };
};

export default useWidgetNavigationBarModel;

const fetchMenuList = async (taskName?: string) => {
  // const response = await fetch('http://localhost:3000/menus');
  // const data = await response.json();
  const list = [
    {
      label: 'menu:홈',
      to: '/home',
    },
    {
      label: 'menu:AI와의_대화',
      to: '/ai-chat',
    },
    {
      label: 'menu:챗플레이',
      to: '/chat-play',
    },
    {
      label: 'menu:챗허브',
      to: '/chat-hub',
    },
    {
      label: 'Embedding Ranker',
      to: '/embedding-history',
    },
    {
      label: 'menu:LLM_템플릿',
      to: taskName ? `${taskName}` : '/llm-template',
    },
  ];
  return list;
};
