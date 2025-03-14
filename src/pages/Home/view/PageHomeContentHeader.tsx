// @/pages/home/ui/Header.tsx

import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useHomeViewModel } from '../viewModel/usePageHomeViewModel';

const Header: FC = () => {
  const { t } = useTranslation(['menu']);

  const { headerData } = useHomeViewModel();
  if (!headerData) return null;

  return (
    <header className="flex flex-col items-center justify-center gap-5">
      <h2 className="flex justify-center items-center bg-white border border-line rounded-3xl w-[22rem] h-[2.5rem] text-lgBold">
        {/* <h2 className="flex justify-center items-center bg-white border border-line rounded-3xl w-[16.4375rem] h-[2.5rem] text-lgBold"> */}
        {t(headerData.subTitle)}
        <img src={headerData.subTitleImage} alt={t(headerData.title)} className="ml-2 h-[1.3rem]" />
      </h2>
      <figure>
        <img src={headerData.titleImage} alt={t(headerData.title)} draggable="false" />
        {/* <figcaption className="hidden">{t(headerData.title)}</figcaption> */}
      </figure>
    </header>
  );
};

export default Header;
