import { FC } from 'react';

import { useHomeViewModel } from '@/pages/Home/viewModel/usePageHomeViewModel';
import FeatureCardListViewLLM from '../components/FeatureCardListViewLLM/view/FeatureCardListViewLLM';

const PageLLMTemplates: FC = () => {
  const { templateData } = useHomeViewModel();

  return (
    <>
      {templateData && templateData.list && templateData.list.length > 0 && (
        <section className="w-[64rem] mx-auto flex flex-col justify-center items-center gap-[1.875rem]">
          <FeatureCardListViewLLM
            {...templateData}
            containerClassName="flex flex-col justify-center items-center gap-[1.875rem] my-24"
            listClassName="gap-x-[1.875rem] gap-y-[1.875rem] xl:gap-x-[2.5rem] xxl:gap-x-[2.1875rem] grid grid-cols-2 xl:grid-cols-3"
            type={'middle'}
          />
        </section>
      )}
    </>
  );
};

export default PageLLMTemplates;
