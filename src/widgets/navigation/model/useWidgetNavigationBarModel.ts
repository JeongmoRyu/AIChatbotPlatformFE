import { useEffect, useState } from 'react';

interface Menu {
  label: string;
  to: string;
}

const useWidgetNavigationBarModel = () => {
  const [menuList, setMenuList] = useState<Menu[]>([]);

  useEffect(() => {
    fetchMenuList().then((list) => setMenuList(list));
  }, []);

  return { menuList };
};

export default useWidgetNavigationBarModel;

const fetchMenuList = async () => {
  // const response = await fetch('http://localhost:3000/menus');
  // const data = await response.json();
  const list = [
    {
      label: '홈',
      to: '/home',
    },
    {
      label: 'AI와의 대화',
      to: '/ai-chat',
    },
    {
      label: '챗플레이',
      to: '/chat-play',
    },
    {
      label: '챗허브',
      to: '/chat-hub',
    },
    {
      label: 'Embedding Ranker',
      to: '/embedding-ranker',
    },
    {
      label: 'LLM 템플릿',
      to: '/llm-template',
    },
  ];
  return list;
};
