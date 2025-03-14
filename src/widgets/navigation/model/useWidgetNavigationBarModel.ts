import { useRestfulCustomAxios } from '@/shared/hooks/useRestfulCustomAxios';
import { userAuthority as useUserAuthority } from '@/shared/store/onpromise';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

interface Menu {
  title: string;
  to: string;
}

const useWidgetNavigationBarModel = () => {
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const userAuthority = useRecoilValue(useUserAuthority);
  const { sendRequest } = useRestfulCustomAxios();

  let pathname = window.location.pathname;
  // if (!pathname.startsWith('/llm-template')) pathname = '';

  const getFetchMenuList = async (sendRequest: Function) => {
    const response = await sendRequest('/menu/list/TOP', 'get', undefined, undefined);
    if (response && response.data) {
      if (response.data.code === 'F000') {
        return response.data;
      }
    }
    return null;
  };
  const fetchMenuList = async (taskName?: string) => {
    const response = await getFetchMenuList(sendRequest);
    const list = [
      {
        title: 'menu:홈',
        to: '/home',
      },
      {
        title: 'menu:AI와의_대화',
        to: '/ai-chat',
      },
      {
        title: 'menu:LLM_템플릿',
        to: '/llm-template',
      },
    ];
    // const response = await fetch('http://localhost:3000/menus');
    // const list = [
    //   {
    //     label: 'menu:홈',
    //     to: '/home',
    //   },
    //   {
    //     label: 'menu:AI와의_대화',
    //     to: '/ai-chat',
    //   },
    //   {
    //     label: 'menu:챗플레이',
    //     to: '/chat-play',
    //   },
    //   {
    //     label: 'menu:챗허브',
    //     to: '/chat-hub',
    //   },
    //   {
    //     label: 'Embedding Ranker',
    //     to: '/embedding-history',
    //   },
    //   {
    //     label: 'menu:LLM_템플릿',
    //     to: taskName ? `${taskName}` : '/llm-template',
    //   },
    // ];
    if (response && response.data) {
      const apiList = response.data.map((item: any) => ({
        title: item.title,
        to: item.to,
      }));
      return apiList;
    }
    return list;
  };

  useEffect(() => {
    fetchMenuList(pathname).then((list) => {
      const adjustedList = userAuthority === '' ? list.filter((item: any) => item.label !== 'Embedding Ranker') : list;
      setMenuList(adjustedList);
    });
  }, [pathname]);

  return { menuList };
};

export default useWidgetNavigationBarModel;
