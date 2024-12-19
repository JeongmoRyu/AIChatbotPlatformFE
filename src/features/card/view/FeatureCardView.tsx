import tw from 'tailwind-styled-components';
import { FC } from 'react';

import GoToButtonComponent from './FeatureCardButtonView';
import { useTranslation } from 'react-i18next';

const cardStyles = {
  large: `
    px-9
    py-7
    w-[21.6875rem]
    xl:w-[29.6875rem]
    xxl:w-[31.25rem]
    h-[11.25rem]
    shadow-llmBox
  `,
  middle: `
    p-[1.5625rem]
    w-[23rem]
    xl:w-[18.75rem]
    xxl:w-[20rem]
    h-[13rem]
    shadow-llmBox
  `,
  small: `
    p-[1.5625rem]
    w-[20rem]
    xl:w-[18.75rem]
    xxl:w-[20rem]
    h-[12.44rem]
    shadow-llmBox
  `,
};

const Card = tw.a<{ $type: CardType }>`
  flex
  flex-col
  justify-between
  bg-white
  border
  border-line
  rounded-lg
  ${({ $type }) => cardStyles[$type]}
`;

const CardContentUI = tw.div`
  flex
  flex-col
  justify-between
  gap-2
  w-full
  h-full
`;

const CardTitle = tw.h4`
  text-lgBold
`;

const CardDescription = tw.p<{ $type: CardType; $llm: string }>`
  line-clamp-3
  h-15
  leading-[1.1875rem]
  overflow-hidden
  ${({ $type }) => ($type === 'large' ? 'line-clamp-2 h-10' : 'line-clamp-3 h-15')}
    ${({ $llm }) => ($llm !== '' ? '-mt-2' : '')}
`;
const FeatureCardView: FC<CardComponentProps> = ({
  title,
  subTitle,
  description,
  type = 'small',
  to,
  iconURL = '',
  onClick,
  redirect,
}) => {
  const { t, i18n } = useTranslation(['llm']);

  return (
    <>
      <Card $type={type} data-redirect={redirect} onClick={onClick} href={redirect}>
        <CardContentUI>
          <CardTitle>
            {t(title)}
            {subTitle && i18n.language === 'ko' && <span className="text-lg"> {t(subTitle)}</span>}
          </CardTitle>
          <CardDescription $type={type} $llm={iconURL}>
            {t(description)}
          </CardDescription>
          {iconURL && <img src={iconURL} alt={iconURL} className={` w-6 h-6 mt-8`} />}
        </CardContentUI>
        {to && <GoToButtonComponent to={to} />}
      </Card>
    </>
  );
};

export default FeatureCardView;
