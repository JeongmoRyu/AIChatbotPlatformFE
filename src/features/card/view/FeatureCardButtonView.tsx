import tw from 'tailwind-styled-components';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface CardButtonProps {
  $width: string;
}

const CardButton = tw(Link)<CardButtonProps>`
  flex
  justify-center
  items-center
  gap-1
  bg-black
  px-2.5
  py-1
  rounded-[.3125rem]
  h-7
  text-white
   ${({ $width }) => $width} 
`;

const FeatureCardButtonView: FC<GoToProps> = ({ to }) => {
  const { t, i18n } = useTranslation(['common']);

  const width = i18n.language === 'ko' ? 'w-[5.625rem]' : 'w-[9.5rem]';

  return (
    <div className="flex items-end w-full h-full">
      <CardButton to={to} $width={width}>
        <span className="-mb-0.5">{t('common:바로가기')}</span>
        <svg width="9" height="24" viewBox="0 0 9 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 17L7 12" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round" />
          <path d="M7 12L2 7" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round" />
        </svg>
      </CardButton>
    </div>
  );
};

export default FeatureCardButtonView;
