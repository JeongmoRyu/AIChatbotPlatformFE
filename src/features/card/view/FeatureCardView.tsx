// @/features/card/ui/CardComponent.tsx

import tw from 'tailwind-styled-components';
import { FC } from 'react';

import GoToButtonComponent from './FeatureCardButtonView';

const cardStyles = {
  large: `
    px-9
    py-7
    w-[21.6875rem]
    xl:w-[29.6875rem]
    xxl:w-[31.25rem]
    h-[11.25rem]
  `,
  small: `
    p-[1.5625rem]
    w-[20rem]
    xl:w-[18.75rem]
    xxl:w-[20rem]
    h-[10rem]
  `,
};

const Card = tw.section<{ $type: CardType }>`
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

const CardDescription = tw.p<{ $type: CardType }>`
  line-clamp-3
  h-15
  leading-[1.1875rem]
  overflow-hidden
  ${({ $type }) => ($type === 'large' ? 'line-clamp-2 h-10' : 'line-clamp-3 h-15')}
`;
const FeatureCardView: FC<CardComponentProps> = ({ title, subTitle, description, type = 'small', to }) => {
  return (
    <Card $type={type}>
      <CardContentUI>
        <CardTitle>
          {title}
          {subTitle && <span className="text-lg"> {subTitle}</span>}
        </CardTitle>
        <CardDescription $type={type}>{description}</CardDescription>
      </CardContentUI>
      {to && <GoToButtonComponent to={to} />}
    </Card>
  );
};

export default FeatureCardView;
