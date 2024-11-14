// @/pages/home/ui/Header.tsx

import { FC } from 'react';

import { useHomeViewModel } from '../viewModel/usePageHomeViewModel';

const Header: FC = () => {
  const { headerData } = useHomeViewModel();
  if (!headerData) return null;

  return (
    <header className="flex flex-col justify-center items-center gap-5">
      <h2 className="flex justify-center items-center bg-white border border-line rounded-3xl w-[16.4375rem] h-[2.5rem] text-lgBold">
        {headerData.subTitle}
      </h2>
      <figure>
        <img src={headerData.titleImage} alt={headerData.title} draggable="false" />
        {/* <figcaption className="hidden">{headerData.title}</figcaption> */}
      </figure>
    </header>
  );
};

export default Header;
