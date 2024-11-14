// @/pages/home/index.tsx

import FeatureCardListView from '@/features/cardList/view/FeatureCardListView';
import tw from 'tailwind-styled-components';
import { FC } from 'react';

import Header from './PageHomeContentHeader';
import { useHomeViewModel } from '../viewModel/usePageHomeViewModel';

const PageHome: FC = () => {
  const { solutionData, templateData } = useHomeViewModel();

  return (
    <Container>
      <Header />
      {solutionData && solutionData.list && solutionData.list.length > 0 && (
        <FeatureCardListView {...solutionData} listClassName="gap-[1.875rem] grid grid-cols-2" />
      )}
      {templateData && templateData.list && templateData.list.length > 0 && (
        <section className="flex flex-col justify-center items-center gap-[1.875rem]">
          <FeatureCardListView
            {...templateData}
            containerClassName="flex flex-col justify-center items-center gap-[1.875rem]"
            listClassName="gap-x-[1.875rem] gap-y-[1.875rem] xl:gap-x-[2.5rem] xxl:gap-x-[2.1875rem] grid grid-cols-2 xl:grid-cols-3"
          />
        </section>
      )}
    </Container>
  );
};

export default PageHome;

export const Container = tw.div`
  w-full
  h-full
  flex
  flex-col
  gap-[5rem]
  items-center
  text-black
  max-w-default
  xl:max-w-xl
  xxl:max-w-xxl
`;
