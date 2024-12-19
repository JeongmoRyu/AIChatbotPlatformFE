import { useEffect, useState } from 'react';

interface IModel {
  id: string;
  name: string;
}

export const useWidgetSelectorModel = () => {
  const [modelList, setModelList] = useState<IModel[]>([]);

  useEffect(() => {
    fetchModelList().then((list) => setModelList(list));
  }, []);

  return {
    modelList,
  };
};

const fetchModelList = async () => {
  // const response = await fetch('http://localhost:3000/menus');
  // const data = await response.json();
  const list = [
    {
      id: 'hummingbird',
      name: 'Llama3 MAAL Hummingbird',
    },
    {
      id: 'albatross',
      name: 'Llama3.1 MAAL Albatross',
    },
    {
      id: '4o',
      name: 'OpenAI GPT-4o',
    },
  ];
  return list;
};
